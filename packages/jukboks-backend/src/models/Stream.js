const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { SongSchema } = require('./Song');

const StreamStatus = {
  DRAFT: 1,
  SCHEDULED: 2,
  STARTED: 3,
  ENDED: 4,
};

const StreamSchema = new mongoose.Schema({
  uuid: { type: String, default: () => nanoid(), unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // author <-> User
  songs: [{ type: SongSchema, required: true }],
  visualization: { type: Boolean, default: false },
  reactions: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: true },
  dt_start: { type: Date },
  status: { type: Number, enum: Object.values(StreamStatus), default: StreamStatus.DRAFT },
});

// TODO: add virtual `dt_end`

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream, StreamStatus };
