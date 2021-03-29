const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  author: { type: Schema.Types.ObjectId, ref: 'User' }, // author <-> User
  playlist: { type: mongoose.Types.ObjectId, ref: 'Playlist' }, // Stream.playlistId <-> Playlist.streamId
});

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream };
