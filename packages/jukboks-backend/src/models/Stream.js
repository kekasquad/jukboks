const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { nanoid } = require('nanoid');
const { SongSchema } = require('./Song');

const StreamSchema = new mongoose.Schema({
  uuid: { type: String, default: () => nanoid(), unique: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // author <-> User
  songs: [{ type: SongSchema, required: true }],
  // visualization: { type: Boolean, default: false },
  // reactions: { type: Boolean, default: false },
  // isPrivate: { type: Boolean, default: true },
  dt_start: { type: Number },
  duration: { type: Number }, // duration in *seconds*
});

StreamSchema.index({ dt_start: -1 });

StreamSchema.virtual('dt_end').get(function () {
  return this.dt_start + this.duration;
});

StreamSchema.methods.isStarted = function () {
  const now = Date.now();
  return this.dt_start < now && now < this.dt_end;
};

StreamSchema.methods.isEnded = function () {
  return Date.now() > this.dt_end;
};

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream };
