const { Stream } = require('../models/Stream');
const { EVENTER_EVENTS } = require('../eventer');

const EVENTS = {
  STREAM_JOIN: 'stream:join',
};

const ERRORS = {
  NOT_FOUND: 'Stream not found',
  ENDED: 'Stream has already eneded',
};

// Network delay to the client
const NETWORK_PING = 250;

const registerStreamHandlers = (io, logger, socket) => {
  const joinStream = async (uuid) => {
    logger.info({ msg: 'Client joined stream', uuid, id: socket.id });
    const stream = await Stream.findOne({ uuid });
    if (!stream) {
      throw new Error(ERRORS.NOT_FOUND);
    }

    if (Date.now() > stream.dt_end) {
      throw new Error(ERRORS.ENDED);
    }

    socket.join(uuid);

    if (Date.now() > stream.dt_start) {
      // TODO: check for race conditions

      const played = Date.now() - stream.dt_start;

      let elapsed = 0;
      for (const song of stream.songs) {
        // find song such as: songPrev < now < song
        if (elapsed < played && played < elapsed + song.duration) {
          // Send current playing song with offset (milliseconds)
          // 1000 milliseconds for network delay
          socket.emit(EVENTER_EVENTS.SONG_STARTED, { ...song._doc, offset: played - elapsed + NETWORK_PING });
          break;
        }
        elapsed += song.duration * 1000;
      }
    }
  };

  socket.on(EVENTS.STREAM_JOIN, joinStream);
};

module.exports = { registerStreamHandlers, STREAM_EVENTS: EVENTS };
