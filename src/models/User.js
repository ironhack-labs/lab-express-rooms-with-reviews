// Importación

const { Schema, model } = require("mongoose")

// Schema
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true,"User name is required."]
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
        required: [true, "Password is required."]
    },
    imgURL: String
}, {timestamps: true})

// Model
const User = model("User", userSchema)

// Exportación
module.exports = User