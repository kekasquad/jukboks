const socketio = require('socket.io');
const { ObjectID } = require('mongodb');
const { Eventer, EVENTER_EVENTS } = require('../eventer');
const { registerStreamHandlers, STREAM_EVENTS } = require('./stream');

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
    this.logger = logger;
    this.eventer = new Eventer(logger);

    this.users = {};

    this.registerEveneterHandlers.bind(this)();

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.addSocket = this.addSocket.bind(this);
    this.isUserJoined = this.isUserJoined.bind(this);
    this.reaction = this.reaction.bind(this);
    this.message = this.message.bind(this);
  }

  start() {
    this.eventer.start();
    this.logger.info('Core started');
  }

  stop() {
    this.eventer.stop();
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

  addSocket(socket) {
    socket[Symbol.for('nodejs.rejection')] = (err) => {
      this.logger.error(err);
      socket.emit('error', err.message);
    };

    // All the handlers for the events from Client -> Core
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
}

module.exports = { Core, EVENTS };
