const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  url: String,
  duration: Number, // ms!
});

SongSchema.options.toJSON = {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
};

module.exports = { SongSchema };
