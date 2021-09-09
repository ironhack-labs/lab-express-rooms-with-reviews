const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	// favorites: [{ type: Schema.Types.ObjectId, ref: 'Room', default: [] }]
});

const User = model('User', userSchema);

module.exports = User;
