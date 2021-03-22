const { User } = require('../models/User')

async function routes(fastify, options) {

  publicFields = {
    _id: false,
    username: true,
    name: true,
    streams: true
  };

  fastify.post(
    '/auth',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            token: {
              type: 'string'
            },
          },
        },
      },
    },
    async (req, reply) => {

      const username = req.body.username;
      const password = req.body.password;

      const person = await User.findOne({ username });
      if (!person) {
        reply.unauthorized("Wrong credentials");
      }
      if (password != person.password) {
        reply.unauthorized("Wrong credentials");
      }

      const token = fastify.jwt.sign({ username: username });
      reply.send({ token });
    });

  // fastify.get('/all', async (req, reply) => {
  //   const persons = await User.find({}, this.publicFields);
  //   if (!persons) {
  //     reply.notFound("Users not found");
  //   }
  //   reply.send(persons);
  // });

}

module.exports = routes;
