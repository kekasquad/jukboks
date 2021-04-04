const EVENTS = {
  STREAM_JOIN: 'stream:join',
};

const registerStreamHandlers = (io, logger, socket) => {
  const joinStream = (uuid) => {
    logger.info({ msg: 'Client joined stream', uuid, id: socket.id });
    socket.join(uuid);
  };

  socket.on(EVENTS.STREAM_JOIN, joinStream);
};

module.exports = { registerStreamHandlers, STREAM_EVENTS: EVENTS };
