const { Stream, calculateTimes, publicFields } = require('../models/Stream');
const { User } = require('../models/User');

// TODO: authorize operations
// TODO(kabachook): set `additionalProperties: false` in schema
// TODO: Check mass assignment from the req.body

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
        throw new reply.forbidden();
      }

      const updatedStream = Stream(request.body);
      calculateTimes(updatedStream);
      try {
        updatedStream.validate();
      } catch (err) {
        throw new fastify.notAcceptable(err.errors);
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
        throw new reply.forbidden();
      }

      await Stream.deleteOne({ _id: stream._id });

      reply.send({ deleted: true });
    },
  );

  // #endregion
}

module.exports = routes;
