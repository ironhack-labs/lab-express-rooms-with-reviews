const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: String,
    password: String,
    fullName: String
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
