const EventEmitter = require('events');
const { Stream, StreamStatus } = require('../models/Stream');
const Emittery = require('emittery');

const EVENTS = {
  STREAM_STARTED: 'stream:started',
};

class Eventer extends Emittery {
  constructor() {
    super();
    this.pullInterval = 5;
    this.timeBefore = 60; // pull Streams that are due to start in less or eq than 60 sec

    this.streamsTimers = {};

    this.start = this.start.bind(this);
    this.stop = this.stopt.bind(this);
    this.pull = this.pull.bind(this);
  }
  start() {
    this.pullTimeout = setInterval(this.pull, this.pullInterval);
    setImmediate(this.pull);
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
     * For Streams in status `SCHEDULED`:
     * 1. Pull soonest streams, i.e dt_start - now() <= this.timeBefore
     * 2. Set timers for firing `streamStarted` event
     * 3. Before firing an event, check that stream has not changed its state (?)
     * 4. On `streamStarted` event schedule timers for `song` event (send it 2s earlier?)
     */

    // 1
    const streams = await Stream.find({
      status: StreamStatus.SCHEDULED,
      dt_start: {
        $lt: Date.now() + this.timeBefore,
        $gt: Date.now(),
      },
    });

    // 2
    for (const stream of streams) {
      if (uuid in this.streamsTimers) continue;

      this.streamsTimers[stream.uuid] = setTimeout(() => {
        delete this.streamsTimers[stream.uuid];
        this.emit(EVENTS.STREAM_STARTED, stream);
      }, stream.dt_start - Date.now());
    }
  }
}

module.exports = { Eventer };
