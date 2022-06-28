const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { 
    type: String, 
    required: [true, "imageUrl is required."], 
},
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  // reviews: [] // we will update this field a bit later when we create review model
  // reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }];
});

module.exports = model("Room", roomSchema);
