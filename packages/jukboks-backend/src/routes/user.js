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
        response: {
          200: {
            ok: {
              type: 'string',
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
      reply.notFound("Wrong credentials");
    }
    if (password != person.password) {
      reply.notFound("Wrong credentials");
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
