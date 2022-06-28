const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
  username: {
    type: String,
    unique: true,
    required: true,
    fullName: String,
  },

  password: {
  type: String,
  unique: true,
  required: true, 
  lowercase: true,
  }
},
{
  timestamps: true,
});

const User = model("User", userSchema);

module.exports = User;
