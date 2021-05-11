const bcrypt = require('bcrypt');
const { User, publicFields } = require('../models/User');

const BCRYPT_ROUNDS = 12;

const genJWTPayload = (username) => ({
  username,
});

async function routes(fastify, options) {
  fastify.post(
    '/auth/login',
    {
      schema: {
        description: 'Login',
        additionalProperties: false,
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      const person = await User.findOne({ username });
      if (!person || !bcrypt.compareSync(password, person.password)) {
        return reply.unauthorized('Wrong credentials');
      }

      const token = fastify.jwt.sign(genJWTPayload(username));
      reply.send({ token });
    },
  );

  fastify.post(
    '/auth/signup',
    {
      schema: {
        description: 'Sign up',
        additionalProperties: false,
        body: {
          type: 'object',
          required: ['username', 'password', 'name'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
          },
        },
        response: {
          200: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
    async (request, reply) => {
      let { username, password, name } = request.body;

      let user;
      user = await User.findOne({ username });
      if (user) {
        return reply.unprocessableEntity('User already exists');
      }

      password = bcrypt.hashSync(password, BCRYPT_ROUNDS);
      user = new User({ username, password, name });
      await user.save();

      const token = fastify.jwt.sign(genJWTPayload(username));
      reply.send({ token });
    },
  );

  fastify.get(
    '/me',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
      schema: {
        description: 'Get profile data',
        response: {
          200: {
            username: { type: 'string' },
            name: { type: 'string' },
            streams: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  uuid: { type: 'string' },
                  songs: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        artist: { type: 'string' },
                        url: { type: 'string' },
                        duration: { type: 'integer' },
                      },
                    },
                  },
                  dt_start: { type: 'integer' },
                  dt_end: { type: 'integer' },
                  duration: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const user = await User.findOne({ username: request.user.username }, publicFields).populate(
        'streams',
        '-_id -_v',
      );

      if (!user) {
        return reply.notFound();
      }

      reply.send(user);
    },
  );
}

module.exports = routes;
