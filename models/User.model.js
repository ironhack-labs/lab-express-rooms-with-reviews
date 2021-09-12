const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
		type: String,
		// required: true,
		unique: true
	},
	firstname: {
		type: String,
		// required: true
	},
	lastname: {
		type: String,
		// required: true
	},
	email: String,
	password: {
		type: String,
		required: true
	},
	slackID: String,
	avatar: String
});

const User = model("User", userSchema);

module.exports = User;
