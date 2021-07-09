const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
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
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "roomId",
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
