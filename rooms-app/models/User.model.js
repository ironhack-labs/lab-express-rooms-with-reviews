const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
  username: {type: String, value: true},
  email: {type: String, value: true},
  password: {type: String, value: true},
  fullName: {type: String, value: true},
  password: {type: String, value: true},
  slackID: {type: String},
  googleID: {type: String},
  },
  {
  timestamps: true
  
});

const User = model("User", userSchema);

module.exports = User;
