//1.Import
const { Schema, model }          =require("mongoose")


//2.Schema
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "User name is required"] 
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Use a valid email.']
    }, 
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    imgUrl: String
}, {timestamps: true})

// Model
const User = model('User', userSchema)

// Export
module.exports = User