const socketio = require('socket.io');
const { ObjectID } = require('mongodb');
const { Eventer, EVENTER_EVENTS } = require('../eventer');
const { registerStreamHandlers, STREAM_EVENTS } = require('./handlers/stream');
const { ListenersCounter } = require('./listenersCounter');
const autobind = require('../utils/autobind');

const EVENTS = {
  ...EVENTER_EVENTS,
  ...STREAM_EVENTS,
  STREAM_REACTION: 'stream:reaction',
  STREAM_MESSAGE: 'stream:message',
};

class Core {
  /**
   *
   * @param {import('socket.io').Server} io
   * @param {import('pino').Logger} logger
   */
  constructor(io, logger) {
    this.io = io;
    this.eventer = new Eventer(logger);
    this.listenersCounter = new ListenersCounter(io, eventer, logger);
    this.logger = logger;

    autobind(this);

    this.registerEveneterHandlers();
  }

  start() {
    this.eventer.start();
    this.listenersCounter.start();
    this.logger.info('Core started');
  }

  stop() {
    this.eventer.stop();
    this.listenersCounter.stop();
    this.logger.info('Core stopped');
  }

  // All the handlers for the events from Eventer -> Core -> Client
  registerEveneterHandlers() {
    this.eventer.on(EVENTS.STREAM_STARTED, (stream) => {
      this.logger.debug({ msg: 'Stream started', uuid: stream.uuid });
      this.io.to(stream.uuid).emit(EVENTS.STREAM_STARTED);
    });

    this.eventer.on(EVENTS.STREAM_ENDED, async (stream) => {
      this.logger.debug({ msg: 'Stream ended', uuid: stream.uuid });
      this.io.to(stream.uuid).emit(EVENTS.STREAM_ENDED);

      // leave stream rooms
      this.io.in(stream.uuid).socketsLeave(stream.uuid);
    });

    this.eventer.on(EVENTS.SONG_STARTED, ({ song, stream }) => {
      this.logger.debug({ msg: 'Song started', uuid: stream.uuid, id: song._id });
      this.io.to(stream.uuid).emit(EVENTS.SONG_STARTED, song);
    });
  }

  /**
   * Add Core handlers to socket
   * @param {import('socket.io').Socket} socket
   */
  addSocket(socket) {
    // In case something bad happens
    socket[Symbol.for('nodejs.rejection')] = (err) => {
      this.logger.error(err);
      socket.emit('error', err.message);
    };

    // All the handlers for the events from Core <- Client
    registerStreamHandlers(this.io, this.logger, socket);
  }

  /**
   * Returns if user is joined to stream
   * @param {ObjectID|string} id user id
   * @param {string} uuid stream uuid
   * @returns boolean
   */
  isUserJoined(id, uuid) {
    for (const sid of this.io.of('/').adapter.rooms.get(uuid)) {
      const socket = this.io.of('/').sockets.get(sid);
      if (!socket) throw new Error("Can't find sid in sockets"); // Race condition?
      if (socket.user._id.equals(new ObjectID(id))) return true;
    }
    return false;
  }

  reaction(uuid, text) {
    this.io.to(uuid).emit(EVENTS.STREAM_REACTION, text);
  }

  message(uuid, text) {
    this.io.to(uuid).emit(EVENTS.STREAM_MESSAGE, text);
  }

  listeners(uuid) {
    return this.listenersCounter.listeners(uuid);
  }
}

module.exports = { Core, EVENTS };
