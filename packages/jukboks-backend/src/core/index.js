const socketio = require('socket.io');
const { Eventer, EveneterEvenets } = require('../eventer');
const { registerStreamHandlers, STREAM_EVENTS } = require('./stream');

const EVENTS = {
  ...EveneterEvenets,
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
    this.eventer = new Eventer();

    this.registerEveneterHandlers.bind(this)();

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.addSocket = this.addSocket.bind(this);
  }

  start() {
    this.eventer.start();
  }

  stop() {
    this.eventer.stop();
  }

  registerEveneterHandlers() {
    this.eventer.on(EVENTS.STREAM_STARTED, (stream) => {
      this.io.to(stream.uuid).emit(EVENTS.STREAM_STARTED);
    });
  }

  addSocket(socket) {
    // On connect logic
    registerStreamHandlers(this.io, this.logger, socket);
  }
}

module.exports = { Core, EVENTS };
