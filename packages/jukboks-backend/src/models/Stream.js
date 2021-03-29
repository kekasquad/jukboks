const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const StreamSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  uuid: { type: String, default: () => nanoid() },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // author <-> User
  playlist: { type: mongoose.Types.ObjectId, ref: 'Playlist', required: true }, // Stream.playlistId <-> Playlist.streamId
  visualization: { type: Boolean, default: False },
  reactions: { type: Boolean, default: False },
  private: { type: Boolean, default: False },
});

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream };
