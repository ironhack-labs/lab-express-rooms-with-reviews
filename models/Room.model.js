const mongoose     = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  owner: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
})

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
