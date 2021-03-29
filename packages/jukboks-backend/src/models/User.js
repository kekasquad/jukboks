const mongoose = require('mongoose');

const publicFields = {
  _id: false,
  username: true,
  name: true,
  streams: true,
};

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  streams: [{ type: mongoose.Types.ObjectId, ref: 'Stream' }], // via foreign key of Stream: Stream.author
});

const User = mongoose.model('User', UserSchema);

module.exports = { User, publicFields };
