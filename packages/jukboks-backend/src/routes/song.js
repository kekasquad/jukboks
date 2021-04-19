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
      // console.log(songURL);
      let metadata = await parseMetadataByUrl('https://soundcloud.com/fkatwigsupdates/vggapmashup');
      // let json;
      console.log(metadata);
      // reply.send(json);
    },
  );
}

module.exports = routes;
