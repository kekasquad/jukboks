const fp = require('fastify-plugin');
const { Core } = require('../core');

module.exports = fp(
  async function (fastify, opts) {
    const core = new Core(fastify.io, fastify.log);
    fastify.decorate('core', core);
    fastify.addHook('onClose', (fastify, done) => {
      core.stop();
      done();
    });
  },
  { name: 'core', dependencies: ['socket.io'] },
);
