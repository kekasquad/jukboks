const { SongSchema } = require('../models/Song');
const { getMetadata } = require('../soundcloud/index');

async function routes(fastify, options) {
  fastify.post(
    '/song',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema + strict validation
    },
    async (request, reply) => {
      let songURL = request.body.url;
      let metadata = await getMetadata(songURL);
      reply.send(metadata);
    },
  );
}

module.exports = routes;
