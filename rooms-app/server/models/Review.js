const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},
comment: {
type: String,
maxlength: 200,
required: true,
},
});

module.exports = mongoose.model("Review", reviewSchema);