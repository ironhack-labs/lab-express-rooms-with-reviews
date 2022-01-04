const { model, Schema} = require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String,
    fullName: String,
    slackID: String,
    googleID: String
},{
    timestamps: true
})

module.exports = model('User', userSchema)