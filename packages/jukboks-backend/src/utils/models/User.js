const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: mongoose.Types.ObjectId },
	name: { type: String, required: true },
	login: { type: String, required: true },
	password: { type: String, required: true },
	streams: { type: [mongoose.Types.ObjectId] } // via foreign key of Stream: Stream.author
});

const User = mongoose.model("User", UserSchema);

module.exports = { User }