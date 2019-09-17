const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String, //validation for email, unique 
    password: String, //require //secret file for admin, admin
    fullName: String,
}, {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);