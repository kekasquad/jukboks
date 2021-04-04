const Fastify = require('fastify');
const mongoose = require('mongoose');
const { MONGO_URI, isDevelopment, isProd, JWT_SECRET } = require('../config');

async function createServer() {
  const fastify = Fastify({
    logger: {
      prettyPrint: isDevelopment,
      base: null, // remove logging hostname and pid
      level: isDevelopment ? 'debug' : 'info',
    },
  });
  fastify.register(require('fastify-swagger'), {
    exposeRoute: true,
    routePrefix: '/doc',
    openapi: {
      info: 'Jukboks API',
    },
  });

  fastify.register(require('fastify-sensible'));

  fastify.register(require('fastify-jwt'), {
    secret: JWT_SECRET,
    verify: {
      maxAge: "2y",
    },
    sign: {
      expiresIn: "2y"
    }
  });

  fastify.register(require('./plugins/auth'));

  fastify.register(require('./plugins/mongoose'), {
    uri: MONGO_URI,
  });

  // Register WS before handlers
  // fastify.register(require('./plugins/ws'));

  fastify.register(require('./plugins/socket-io'));
  fastify.register(require('./routes/ws'));

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

  fastify.get('/ws', { websocket: true }, (connection, request) => {
    connection.socket.on('message', async (message) => {
      fastify.log.debug({ id: request.id, msg: message });
      connection.socket.send(`Hi! You wrote: ${message}`);
    });
  });

  fastify.register(require('./routes/user'));

  return fastify;
}

module.exports = { createServer };
