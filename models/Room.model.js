const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);

module.exports = Room;
