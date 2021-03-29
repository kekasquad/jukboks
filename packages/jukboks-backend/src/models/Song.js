const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  url: String,
  duration: Number,
});

module.exports = { SongSchema };
