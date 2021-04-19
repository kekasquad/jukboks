const { parseMetadataByUrl } = require('../soundcloud/index');

async function routes(fastify, options) {
  fastify.post(
    '/song',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema + strict validation
    },
    async (request, reply) => {
      let songURL = request.body.url;
      let metadata = await parseMetadataByUrl(songURL);
      let json;
      console.log(metadata);
      reply.send(json);
    },
  );
}

module.exports = routes;
