const mongoose     = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  ownerId : {
      type: String
  },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
