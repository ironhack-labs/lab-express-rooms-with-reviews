const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    fullname: {type: String, required: true},
    // slack login - optional
    slackID: String,
    // google login - optional
    googleID: String
  }, {
    timestamps: true
  });

const User = mongoose.model("User", userSchema);

module.exports = User;
