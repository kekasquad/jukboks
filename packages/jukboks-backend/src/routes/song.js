const { SongSchema } = require('../models/Song');
const { getMetadata } = require('../soundcloud/index');

async function routes(fastify, options) {
  fastify.post(
    '/song',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get song metadata',
        body: {
          type: 'object',
          required: ['url'],
          properties: {
            url: {
              type: 'string',
              description: 'Song URL',
              format: 'uri',
            },
          },
        },
      },
    },
    async (request, reply) => {
      let { url } = request.body;
      let metadata = await getMetadata(url);
      reply.send(metadata);
    },
  );
}

module.exports = routes;
