const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  id: mongoose.Types.ObjectId,
  title: String,
  artist: String,
  url: String,
  duration: Number,
});

const Song = mongoose.model('Song', SongSchema);

module.exports = { Song };
