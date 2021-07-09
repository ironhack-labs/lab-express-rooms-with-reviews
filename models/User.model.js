const mongoose = require("mongoose");

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
