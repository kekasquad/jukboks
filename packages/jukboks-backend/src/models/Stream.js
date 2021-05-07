const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { nanoid } = require('nanoid');
const { SongSchema } = require('./Song');

const publicFields = {
  _id: false,
  __v: false,
  songs: false,
};

const StreamSchema = new mongoose.Schema({
  uuid: { type: String, default: () => nanoid(), unique: true },
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // author <-> User
  songs: [{ type: SongSchema, required: true }],
  dt_start: { type: Number, required: true },
  dt_end: { type: Number },
  duration: { type: Number }, // duration in *ms*
  // Live settings
  showSongs: { type: Boolean, default: true },
  reactions: { type: Boolean, default: false },
});

StreamSchema.index({ dt_start: -1 });
StreamSchema.index({ dt_end: -1 });

StreamSchema.methods.isStarted = function () {
  const now = Date.now();
  return this.dt_start < now && now < this.dt_end;
};

StreamSchema.methods.isEnded = function () {
  return Date.now() > this.dt_end;
};

const Stream = mongoose.model('Stream', StreamSchema);

// Okay i tried using mongoose middlewares for this, but they are awful
/**
 * Mutates stream with `dt_end` and `duration`
 * @param {Stream} stream
 * @returns {Stream}
 */
function calculateTimes(stream) {
  stream.duration = stream.songs.reduce((acc, song) => acc + song.duration, 0); // milliseconds!
  stream.dt_end = stream.dt_start + stream.duration; // milliseconds!
  return stream;
}

module.exports = { Stream, calculateTimes, publicFields };
