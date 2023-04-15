const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
name: { type: String },
description: { type: String },
imageUrl: { type: String },
owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("Room", roomSchema);