const { Stream } = require('../models/Stream');
const Emittery = require('emittery');

const EVENTS = {
  STREAM_STARTED: 'stream:started',
  SONG_STARTED: 'song:started',
};

class Eventer extends Emittery {
  /**
   *
   * @param {import('pino').Logger} logger
   */
  constructor(logger) {
    super();
    this.pullInterval = 5 * 1000;
    this.timeBefore = 60 * 1000; // pull Streams that are due to start in less or eq than 60 sec

    this.streamsTimers = {};
    this.songsTimers = {};

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.pull = this.pull.bind(this);

    this.logger = logger;
  }
  start() {
    this.pullTimeout = setInterval(this.pull, this.pullInterval);
    setImmediate(this.pull);
    this.logger.info('Eventer started');
  }

  stop() {
    for (const uuid in this.streamsTimers) {
      clearTimeout(this.streamsTimers[uuid]);
    }
    clearInterval(this.pullTimeout);
  }

  async pull() {
    /**
     * Main logic for sending events
     *
     * 1.
     * 1.1 Pull soonest streams, i.e dt_start - now() <= this.timeBefore
     * 1.2 Pull streams already live, i.e dt_start < now() < dt_end
     * 2. Set timers for firing `STREAM_STARTED` event
     * 3. Set timers for firing `SONG_STARTED` event
     */

    let streamsScheduled = 0;
    let songsScheduled = 0;

    // 1.1 + 1.2
    const now = Date.now();
    const streams = await Stream.find({
      $or: [
        {
          dt_start: {
            $lt: now + this.timeBefore,
            $gt: now,
          },
        },
        {
          dt_start: {
            $lt: now,
          },
          dt_end: {
            $gt: now,
          },
        },
      ],
    });

    // 2
    for (const stream of streams) {
      if (stream.uuid in this.streamsTimers) continue;

      this.streamsTimers[stream.uuid] = setTimeout(() => {
        delete this.streamsTimers[stream.uuid];
        this.emit(EVENTS.STREAM_STARTED, stream);
      }, stream.dt_start - Date.now());
      streamsScheduled += 1;

      // 3
      let offset = 0;
      for (const song of stream.songs) {
        const id = song._id.toString();
        if (!(id in this.songsTimers)) {
          this.songsTimers[song._id.toString()] = setTimeout(() => {
            delete this.songsTimers[id];
            this.emit(EVENTS.SONG_STARTED, song);
          }, stream.dt_start + offset - Date.now());
          songsScheduled += 1;
        }
        offset += song.duration * 1000;
      }
    }
    this.logger.debug({ msg: 'Pull complete', streamsScheduled, songsScheduled });
    this.logger.debug({ streams: Object.keys(this.streamsTimers), songs: Object.keys(this.songsTimers) });
  }
}

module.exports = { Eventer, EveneterEvenets: EVENTS };
