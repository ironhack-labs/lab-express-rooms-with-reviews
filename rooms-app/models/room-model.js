const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    // roomSchema will 'populate' the 'owner' property by getting the 'user' by its '_id' in database
    // 'ref: "user"' links to the user-model.js:
    // "user" in roomSchema is matching the NAME in the 'mongoose.model(NAME, _schema)' in the user-model.js
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "review" }],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("room", roomSchema);

module.exports = Room;
