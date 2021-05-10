const { EVENTER_EVENTS } = require('../eventer');
const { STREAM_EVENTS } = require('./handlers/stream');
const autobind = require('../utils/autobind');

class ListenersCounter {
  constructor(io, eventer, logger, interval = 5000) {
    this.io = io;
    this.eventer = eventer;
    this.logger = logger;
    this.interval = interval;

    // Stream.uuid -> setInterval() retval
    this.listenersIntervals = {};
    this.unsubscribe = [];

    autobind(this);
  }

  start() {
    // At stream start set interval that will emit current live count to room
    this.eventer.on(EVENTER_EVENTS.STREAM_STARTED, (stream) => {
      this.listenersIntervals = setInterval(() => {
        try {
          const live = this.listeners(stream.uuid);
          this.io.to(stream.uuid).emit(STREAM_EVENTS.STREAM_LISTENERS, live);
        } catch (err) {
          this.io.to(stream.uuid).emit(STREAM_EVENTS.STREAM_LISTENERS, 0);
        }
      }, this.interval);
    });

    // At stream end remove that interval
    this.eventer.on(EVENTER_EVENTS.STREAM_ENDED, (stream) => {
      clearInterval(this.listenersIntervals[stream.uuid]);
    });
  }

  stop() {
    this.unsubscribe.forEach((f) => f());
  }

  listeners(uuid) {
    const room = this.io.of('/').adapter.rooms.get(uuid);
    if (!room) throw new Error('Stream room not found');
    return room.size;
  }
}

module.exports = { ListenersCounter };
