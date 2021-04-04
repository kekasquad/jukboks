const { Core } = require('../core');

async function routes(fastify, options) {
  const core = new Core(fastify.io);

  fastify.io.on('connection', (socket) => {
    fastify.log.info(socket, 'New client connected');
    core.addSocket(socket);
  });
}

module.exports = routes; // Probably should be a fastify plugin since it depends on socket.io
