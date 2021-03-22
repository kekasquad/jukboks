const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  stream: mongoose.Types.ObjectId, // Stream.playlistId <-> Playlist.streamId
  songs: [mongoose.Types.ObjectId], // via foreign key of Song: Song.playlistId
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = { Playlist };
