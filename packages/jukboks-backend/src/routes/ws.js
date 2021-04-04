const { Core } = require('../core');

async function routes(fastify, options) {
  const core = new Core(fastify.io, fastify.log);

  fastify.io.on('connection', (socket) => {
    fastify.log.info({ msg: 'WS client connected', id: socket.id });
    core.addSocket(socket);
  });
  core.start();
}

module.exports = routes; // Probably should be a fastify plugin since it depends on socket.io
