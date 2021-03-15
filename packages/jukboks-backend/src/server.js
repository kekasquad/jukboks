const Fastify = require('fastify');
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

async function createServer() {
  const fastify = Fastify({
    logger: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      base: null, // remove logging hostname and pid
    },
  });
  fastify.register(require('fastify-swagger'), {
    exposeRoute: true,
    routePrefix: '/doc',
    openapi: {
      info: 'Jukboks API',
    },
  });

  fastify.register(require('./plugins/mongoose'), {
    uri: MONGO_URI,
  });

  fastify.get(
    '/ping',
    {
      schema: {
        response: {
          200: {
            ok: {
              type: 'boolean',
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!mongoose.connection || mongoose.connection.readyState !== mongoose.STATES.connected) {
        return reply.code(500).send({ ok: false });
      }
      return { ok: true };
    },
  );

  fastify.register(require('./routes/user'));

  return fastify;
}

module.exports = { createServer };
