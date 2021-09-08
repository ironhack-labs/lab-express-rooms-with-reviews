const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    fullName: { type: String, required: true},
    // slack login - optional
    slackID: String,
    // google login - optional
    googleID: String
  },
  {
    timestamps: true
  }
);


const User = model("User", userSchema);

module.exports = User;
