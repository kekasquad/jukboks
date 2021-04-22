const { Stream, calculateTimes, publicFields } = require('../models/Stream');
const { User } = require('../models/User');

// TODO: authorize operations
// TODO(kabachook): set `additionalProperties: false` in schema
// TODO: Check creation from the req.body

const ERROR = {
  NOT_EXISTS: 'Stream does not exists',
};

async function routes(fastify, options) {
  // #region Stream document

  fastify.get(
    '/stream/:uuid',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      reply.send(stream);
    },
  );

  fastify.post(
    '/stream',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema + strict validation
      // TODO: prevent mass assignment
    },
    async (request, reply) => {
      let stream = Stream(request.body);
      const user = await User.findOne({ username: request.user.username });
      console.log(user);
      stream.author = user._id;
      calculateTimes(stream);
      console.log(stream);
      await stream.save();
      let id = stream._id;
      user.streams.push(stream._id);
      // user.streams = [];
      await user.save();
      const savedStream = await Stream.findOne({ _id: id }, publicFields).populate({
        path: 'author',
        select: 'username -_id',
      });
      reply.send(savedStream);
    },
  );

  fastify.patch(
    '/stream/:uuid',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      //TODO: Patch fields vizualization, isPrivate, reactions
    },
  );

  fastify.delete(
    '/stream/:uuid',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOneAndDelete({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      reply.send({ deleted: true });
    },
  );

  // #endregion

  // #region Stream's song

  fastify.get(
    '/stream/:uuid/songs',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      reply.send(stream.songs);
    },
  );

  // TODO: move songs in playlist
  fastify.put(
    '/stream/:uuid/songs',
    {
      preValidation: [fastify.authenticate],
      // TODO: add schema + strict validation
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      // TODO: authorize the Stream author
      // TODO: forbid changes when stream is started or ended
      stream.set('songs', request.body); // ??????
      await stream.save;
      return stream.songs;
    },
  );

  // #endregion

  // TODO: add route to extract metadata from Soundcloud URL and add song
}

module.exports = routes;
