const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: String,
    password: String,
    fullName: String,
    // slack login - optional
    slackID: String,
    // google login - optional
    googleID: String,
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  // we will update this field a bit later when we create review model
});

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, maxlength: 200 },
});

module.exports = User;
