const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  owner: {
    type: String,
    // type: mongoose.SchemaTypes.ObjectId,
    // ref: "User",
  },
  reviews: [], // we will update this field a bit later when we create review model
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
