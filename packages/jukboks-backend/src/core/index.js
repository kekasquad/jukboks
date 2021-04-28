const socketio = require('socket.io');
const { Eventer, EVENTER_EVENTS } = require('../eventer');
const { registerStreamHandlers, STREAM_EVENTS } = require('./stream');

const EVENTS = {
  ...EVENTER_EVENTS,
  ...STREAM_EVENTS,
};

class Core {
  /**
   *
   * @param {import('socket.io').Server} io
   * @param {import('pino').Logger} logger
   */
  constructor(io, logger) {
    this.io = io;
    this.logger = logger;
    this.eventer = new Eventer(logger);

    this.registerEveneterHandlers.bind(this)();

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.addSocket = this.addSocket.bind(this);
  }

  start() {
    this.eventer.start();
    this.logger.info('Core started');
  }

  stop() {
    this.eventer.stop();
  }

  registerEveneterHandlers() {
    this.eventer.on(EVENTS.STREAM_STARTED, (stream) => {
      this.logger.debug({ msg: 'Stream started', uuid: stream.uuid });
      this.io.to(stream.uuid).emit(EVENTS.STREAM_STARTED);
    });
    this.eventer.on(EVENTS.SONG_STARTED, ({ song, stream }) => {
      this.logger.debug({ msg: 'Song started', uuid: stream.uuid, id: song._id });
      this.io.to(stream.uuid).emit(EVENTS.SONG_STARTED, song);
    });
  }

  addSocket(socket) {
    socket[Symbol.for('nodejs.rejection')] = (err) => {
      socket.emit('error', err);
    };

    registerStreamHandlers(this.io, this.logger, socket);
  }
}

module.exports = { Core, EVENTS };
