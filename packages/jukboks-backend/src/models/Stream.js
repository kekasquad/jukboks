const mongoose = require('mongoose');

const StreamSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  author: mongoose.Types.ObjectId, // author <-> User
  playlist: [mongoose.Types.ObjectId], // Stream.playlistId <-> Playlist.streamId
});

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream };
