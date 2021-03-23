const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  stream: { type: mongoose.Types.ObjectId, ref: 'Stream' }, // Stream.playlistId <-> Playlist.streamId
  songs: [{ type: mongoose.Types.ObjectId, ref: 'Song' }], // via foreign key of Song: Song.playlistId
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

module.exports = { Playlist };
