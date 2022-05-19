const { schema, Model, Schema } = require("mongoose");

const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [],
});

const Room = model("Room", roomSchema);
module.exports = Room;
