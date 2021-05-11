const { Stream } = require('../../models/Stream');
const { EVENTER_EVENTS } = require('../../eventer');

const EVENTS = {
  STREAM_JOIN: 'stream:join',
  STREAM_LISTENERS: 'stream:listeners',
};

const ERRORS = {
  NOT_FOUND: 'Stream not found',
  ENDED: 'Stream has already eneded',
};

// Network delay to the client
const NETWORK_DELAY = 250;

const registerStreamHandlers = (io, logger, socket) => {
  const joinStream = async (uuid, cb) => {
    const stream = await Stream.findOne({ uuid });
    if (!stream) {
      throw new Error(ERRORS.NOT_FOUND);
    }

    if (Date.now() > stream.dt_end) {
      throw new Error(ERRORS.ENDED);
    }

    socket.join(uuid);
    logger.debug({ msg: 'stream:join', uuid, id: socket.id });

    if (Date.now() > stream.dt_start) {
      // TODO: check for race conditions

      const played = Date.now() - stream.dt_start;

      let elapsed = 0;
      for (const song of stream.songs) {
        // find song such as: songPrev < now < song
        if (elapsed < played && played < elapsed + song.duration) {
          // Send current playing song with offset (milliseconds)
          // + network delay
          socket.emit(EVENTER_EVENTS.SONG_STARTED, {
            url: song._doc.url,
            title: song._doc.title,
            artist: song._doc.artist,
            duration: song._doc.duration,
            offset: played - elapsed + NETWORK_DELAY,
          });
          break;
        }
        elapsed += song.duration;
      }
    }
    cb();
  };

  // WIP: not working in cluster
  // TODO: counting all ws sockets instead of unique users
  const streamListeners = (cb) => {
    const rooms = socket.rooms; // Set<string>
    if (!rooms) {
      throw new Error(ERRORS.NOT_FOUND);
    }
    logger.debug({ msg: 'stream:listeners', rooms: Array.from(rooms) });

    const listeners = {};
    const ioRooms = io.of('/').adapter.rooms; // room -> sid
    for (const room of rooms) {
      // exclude the default room
      if (room == socket.id) continue;

      listeners[room] = ioRooms.get(room).size;
    }

    cb(listeners);
  };

  socket.on(EVENTS.STREAM_LISTENERS, streamListeners);
  socket.on(EVENTS.STREAM_JOIN, joinStream);
};

module.exports = { registerStreamHandlers, STREAM_EVENTS: EVENTS };
