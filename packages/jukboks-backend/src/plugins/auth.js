const fp = require('fastify-plugin');
const { TokenExpiredError } = require('jsonwebtoken');

const messages = {
  badRequestErrorMessage: 'Format is `Authorization: Bearer [token]`',
  noAuthorizationInHeaderMessage: 'No Authorization was found in headers',
  authorizationTokenExpiredMessage: 'Authorization token expired',
  authorizationTokenInvalid: (err) => `Authorization token is invalid: ${err.message}`,
};

/*
Sets `request.user` to JWT token payload
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYyIsImlhdCI6MTYxNjQ1NjcyOH0.AfR_Avnz04ATS7ke1OgrlUy0ohHOygK3TtWkdg1hj1M
*/
async function connectAuth(fastify, opts, next) {
  fastify.decorate('authenticate', async function (request, reply, done) {
    const header = request.raw.headers.authorization;
    if (!header) {
      return done(new fastify.httpErrors.unauthorized(messages.noAuthorizationInHeaderMessage));
    }

    let token;
    const parts = header.split(' ');
    if (parts.length === 2) {
      const scheme = parts[0];
      token = parts[1];

      if (!/^Bearer$/i.test(scheme)) {
        return done(new fastify.httpErrors.unauthorized(messages.badRequestErrorMessage));
      }
    } else {
      return done(new fastify.httpErrors.unauthorized(messages.badRequestErrorMessage));
    }

    let decoded;
    try {
      decoded = await fastify.jwt.verify(token);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return done(new fastify.httpErrors.unauthorized(messages.authorizationTokenExpiredMessage));
      } else {
        return done(new fastify.httpErrors.unauthorized(messages.authorizationTokenInvalid(err)));
      }
    }

    fastify.log.debug(decoded, 'Decoded JWT');
    request.user = decoded;
  });

  next();
}

module.exports = fp(connectAuth, {
  name: 'auth',
  dependencies: ['fastify-jwt', 'fastify-sensible'],
});
