const { SongSchema } = require('../models/Song');
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
      console.log(metadata);
      let title = metadata['og:title'];
      let url = metadata['og:url'];
      // let imageURL = metadata['og:image'];
      let artistURL = metadata['soundcloud:user'];
      let artistMetadata = await parseMetadataByUrl(artistURL);
      let artist = artistMetadata['og:title'];
      let duration = 180;
      //TODO: duration
      let song = JSON.stringify({
        title,
        url,
        artist,
        duration,
      });
      reply.send(song);
    },
  );
}

module.exports = routes;
