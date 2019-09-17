const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String, // TO DO: add validation for email
  password: String, //required field 
  fullName: String, //this needs to be 

}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);