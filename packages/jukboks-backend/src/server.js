const Fastify = require('fastify');
const mongoose = require('mongoose');
const { isDevelopment, isProd, MONGO_URI, JWT_SECRET, PUBLIC_URL } = require('../config');

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
  fastify.register(require('fastify-sensible'), {
    errorHandler: false,
  });

  // Client-side
  fastify.register(require('fastify-cors'), {
    origin: isDevelopment ? /localhost/ : PUBLIC_URL,
  });
  fastify.register(require('fastify-helmet'), { contentSecurityPolicy: false });

  // Auth
  fastify.register(require('fastify-jwt'), {
    secret: JWT_SECRET,
    verify: {
      maxAge: '2y',
    },
    sign: {
      expiresIn: '2y',
    },
  });

  fastify.setErrorHandler(function (error, request, reply) {
    if (fastify.httpErrors.createError.isHttpError(error)) {
      if (error.headers) reply.headers(error.headers);
      if (!error.expose) {
        fastify.log.error(error);
        return reply.code(error.status).send({ error: 'Something went wrong' });
      }
      return reply.send({ error: error.message });
    } else {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Something went wrong' });
    }
  });

  fastify.register(require('./plugins/auth'));
  fastify.register(require('./plugins/user'));

  // WebSocket
  fastify.register(require('./plugins/socket-io'));
  fastify.register(require('./routes/ws'));

  // DB
  fastify.register(require('./plugins/mongoose'), {
    uri: MONGO_URI,
  });

  // Routes
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
  fastify.register(require('./routes/stream'));
  fastify.register(require('./routes/song'));

  return fastify;
}

module.exports = { createServer };
