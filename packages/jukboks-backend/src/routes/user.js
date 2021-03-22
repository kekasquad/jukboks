const bcrypt = require('bcrypt');
const { User } = require('../models/User');

const BCRYPT_ROUNDS = 12;

const genJWTPayload = (username) => {
  username;
};

async function routes(fastify, options) {
  publicFields = {
    _id: false,
    username: true,
    name: true,
    streams: true,
  };

  fastify.post(
    '/auth/login',
    {
      schema: {
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
    async (req, reply) => {
      const { username, password } = req.body;

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
        body: {
          type: 'object',
          required: ['username', 'password', 'name'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
    async (req, reply) => {
      let { username, password, name } = req.body;

      password = bcrypt.hashSync(password, BCRYPT_ROUNDS);
      const user = new User({ username, password, name });
      await user.save();

      const token = fastify.jwt.sign(genJWTPayload(username));
      reply.send({ token });
    },
  );

  // fastify.get('/all', async (req, reply) => {
  //   const persons = await User.find({}, this.publicFields);
  //   if (!persons) {
  //     reply.notFound("Users not found");
  //   }
  //   reply.send(persons);
  // });
}

module.exports = routes;
