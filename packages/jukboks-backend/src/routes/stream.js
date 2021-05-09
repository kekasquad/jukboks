const { Stream, calculateTimes, publicFields } = require('../models/Stream');
const { User } = require('../models/User');

// TODO: authorize operations
// TODO(kabachook): set `additionalProperties: false` in schema
// TODO: Check mass assignment from the req.body

const ERROR = {
  NOT_EXISTS: 'Stream does not exists',
  STREAM_NOT_LIVE: 'Stream is not live',
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
      const stream = await Stream.findOne({ uuid }, publicFields).populate({
        path: 'author',
        select: 'username -_id',
      });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      reply.send(stream);
    },
  );

  fastify.post(
    '/stream',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
      // TODO: add schema + strict validation
      // TODO: prevent mass assignment
    },
    async (request, reply) => {
      const stream = Stream(request.body);
      const user = request.user;

      stream.author = user._id;
      calculateTimes(stream);
      await stream.save();
      let id = stream._id;

      user.streams.push(stream._id);
      await user.save();

      const savedStream = await Stream.findOne({ _id: id }, publicFields).populate({
        path: 'author',
        select: 'username -_id',
      });

      reply.send(savedStream.toJSON());
    },
  );

  fastify.put(
    '/stream/:uuid',
    {
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { uuid } = request.params;
      let stream = await Stream.findOne({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      if (stream.author != request.user._id) {
        return reply.forbidden();
      }

      const updatedStream = Stream(request.body);
      calculateTimes(updatedStream);
      try {
        updatedStream.validate();
      } catch (err) {
        return fastify.notAcceptable(err.errors);
      }

      stream = await Stream.findOneAndReplace({ _id: stream._id }, updatedStream, {
        projection: publicFields,
      }).populate({
        path: 'author',
        select: 'username -_id',
      });
      reply.send(stream.toJSON());
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
      const stream = await Stream.findOne({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      if (stream.author != request.user._id) {
        return reply.forbidden();
      }

      await Stream.deleteOne({ _id: stream._id });

      reply.send({ deleted: true });
    },
  );

  // #endregion

  // #region Stream live controls
  // Valid only if stream is live

  /**
   * Check if stream is live
   * @param {Stream} stream
   * @returns boolean
   */
  function isStreamLive(stream) {
    const now = Date.now();
    return stream.dt_start < now && now < stream.dt_end;
  }

  fastify.get(
    '/stream/:uuid/info',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
      // TODO: add schema
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid }, publicFields);

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      if (request.user._id != stream.author) {
        return reply.forbidden();
      }

      if (!isStreamLive(stream)) {
        return reply.conflict(ERRORS.STREAM_NOT_LIVE);
      }

      let elapsed = 0;
      let current, next;
      const played = Date.now() - stream.dt_start;
      for (let i = 0; i < stream.songs.length; i++) {
        const song = stream.songs[i];
        // find song such as: songPrev < now < song
        if (elapsed < played && played < elapsed + song.duration) {
          current = song;
          next = i + 1 < stream.songs.length ? stream.songs[i + 1] : null;
          break;
        }
        elapsed += song.duration;
      }

      // HACK: probably needs to be in core
      const live = fastify.io.of('/').adapter.rooms.get(uuid);

      reply.send({ current: current._doc, next: next ? next._doc : null, live });
    },
  );

  fastify.post(
    '/stream/:uuid/reaction',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
    },
    async (request, reply) => {},
  );

  fastify.post(
    '/stream/:uuid/message',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
    },
    async (request, reply) => {},
  );

  //#endregion
}

module.exports = routes;
