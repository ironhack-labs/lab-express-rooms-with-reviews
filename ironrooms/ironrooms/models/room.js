const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [] // we will update this field a bit later when we create review model
    }, {
    timestamps: true
  });

  const Room = mongoose.model("Room", roomSchema);


  module.exports = Room;