const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
	name: { type: String },
	description: { type: String },
	imageUrl: {
		type: String,
		default:
			'../public/images/room.jpg'
	},
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	reviews: [],
	// reviews: [{type: Schema.Types.ObjectId, ref: 'Review', 
	// 		   default: []}]
});

const Room = model('Room', roomSchema);

module.exports = Room;
