const fp = require('fastify-plugin');
const { User } = require('../models/User');

async function connectUser(fastify, opts, next) {
  fastify.decorate('getUser', async function (request, reply, done) {
    const username = request.user.username;
    if (!username) {
      // Probably never happen
      return done(new fastify.httpErrors.unauthorized("Can't find user"));
    }

    const user = await User.findOne({ username });
    if (!user) {
      // Probably never happen
      return done(new fastify.httpErrors.unauthorized("Can't find user"));
    }
    request.user = user;
  });

  next();
}

module.exports = fp(connectUser, {
  name: 'user',
  dependencies: ['auth'],
});
