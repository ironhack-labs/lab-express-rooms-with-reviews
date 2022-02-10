const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, maxlength: 200 },
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
