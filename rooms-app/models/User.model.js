const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    fullName: {
      type: String,
      require: true,
    },
    slackID: String,
    googleID: String
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
