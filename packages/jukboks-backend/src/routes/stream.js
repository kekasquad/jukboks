const { Stream, calculateTimes, publicFields } = require('../models/Stream');
const { User } = require('../models/User');

const ERROR = {
  NOT_EXISTS: 'Stream does not exists',
  STREAM_NOT_LIVE: 'Stream is not live',
  USER_NOT_JOINED: "You haven't joined the stream",
};

const schemas = {
  CreateOrUpdateStream: {
    type: 'object',
    required: ['title', 'songs', 'dt_start'],
    properties: {
      title: { type: 'string' },
      songs: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'artist', 'url', 'duration'],
          properties: {
            title: { type: 'string' },
            artist: { type: 'string' },
            url: { type: 'string' },
            duration: { type: 'integer' },
          },
        },
      },
      dt_start: { type: 'integer' },
      showSongs: { type: 'boolean' },
      reactions: { type: 'boolean' },
    },
  },
  Reaction: {
    type: 'object',
    required: ['reaction'],
    properties: {
      reaction: { type: 'string' },
    },
  },
  Message: {
    type: 'object',
    required: ['message'],
    properties: {
      message: { type: 'string' },
    },
  },
};

async function routes(fastify, options) {
  // #region Stream document

  fastify.get(
    '/stream/:uuid',
    {
      preValidation: [fastify.authenticate],
      schema: {
        description: 'Get Stream',
        params: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
          },
        },
      },
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
      schema: {
        description: 'Create a Stream',
        additionalProperties: false,
        body: schemas.CreateOrUpdateStream,
      },
    },
    async (request, reply) => {
      const stream = Stream(request.body);
      const user = request.user;

      stream.author = user._id;
      calculateTimes(stream);

      if (stream.dt_start < Date.now()) {
        throw fastify.httpErrors.unprocessableEntity("Stream start time can't be in past");
      }

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
      schema: {
        description: 'Update Stream',
        additionalProperties: false,
        params: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
          },
        },
        body: {
          body: schemas.CreateOrUpdateStream,
        },
      },
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
      schema: {
        description: 'Delete Stream',
        params: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
          },
        },
      },
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
      schema: {
        description: "Get Stream's admin info",
        params: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid });

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      if (!stream.author.equals(request.user._id)) {
        return reply.forbidden();
      }

      if (!isStreamLive(stream)) {
        return reply.conflict(ERROR.STREAM_NOT_LIVE);
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

      // Most likely won't throw since we check the state earlier
      const live = fastify.core.listeners(uuid);
      reply.send({
        current: current._doc.title,
        next: next ? next._doc.title : null,
        live,
        reactions: stream.reactions,
        showSongs: stream.showSongs,
      });
    },
  );

  fastify.post(
    '/stream/:uuid/reaction',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
      schema: {
        description: 'Send a reation',
        params: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
          },
        },
        body: schemas.Reaction,
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid }, publicFields);

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      if (!isStreamLive(stream)) {
        return reply.conflict(ERROR.STREAM_NOT_LIVE);
      }

      if (!fastify.core.isUserJoined(request.user._id, uuid)) {
        return reply.conflict(ERROR.USER_NOT_JOINED);
      }

      const { reaction } = request.body;
      fastify.core.reaction(uuid, reaction);
      return reply.status(202).send();
    },
  );

  fastify.post(
    '/stream/:uuid/message',
    {
      preValidation: [fastify.authenticate, fastify.getUser],
      schema: {
        description: 'Send a message',
        params: {
          type: 'object',
          properties: {
            uuid: { type: 'string' },
          },
        },
        body: schemas.Message,
      },
    },
    async (request, reply) => {
      const { uuid } = request.params;
      const stream = await Stream.findOne({ uuid }, publicFields);

      if (!stream) {
        return reply.notFound(ERROR.NOT_EXISTS);
      }

      if (!request.user._id.equals(stream.author)) {
        return reply.forbidden();
      }

      if (!isStreamLive(stream)) {
        return reply.conflict(ERROR.STREAM_NOT_LIVE);
      }

      if (!fastify.core.isUserJoined(request.user._id, uuid)) {
        return reply.conflict(ERROR.USER_NOT_JOINED);
      }

      const { message } = request.body;
      fastify.core.message(uuid, message);
      return reply.status(202).send();
    },
  );

  //#endregion
}

module.exports = routes;
