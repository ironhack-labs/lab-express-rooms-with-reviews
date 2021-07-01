const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user: { type: String },
  comment: { type: String, maxlength: 200 },
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
