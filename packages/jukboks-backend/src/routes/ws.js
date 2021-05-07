const { Core } = require('../core');
const { User } = require('../models/User');

async function routes(fastify, options) {
  const core = new Core(fastify.io, fastify.log);

  fastify.io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Not authorized'));
      }

      fastify.jwt.verify(token, (err, decoded) => {
        if (err) return next(err);
        fastify.log.debug({ msg: 'WS JWT', decoded });
        User.findOne({ username: decoded.username }, function (err, user) {
          if (err) return next(err);
          socket.user = user;
          next();
        });
      });
    } catch (err) {
      fastify.log.error(err);
      next(new Error('Something bad happened'));
    }
  });

  fastify.io.on('connection', (socket) => {
    fastify.log.info({ msg: 'WS client connected', id: socket.id });
    core.addSocket(socket);
  });

  core.start();
}

module.exports = routes; // Probably should be a fastify plugin since it depends on socket.io
