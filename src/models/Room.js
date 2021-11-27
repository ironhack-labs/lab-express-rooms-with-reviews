// Import - Modelo de rooms
const { Schema, model } = require('mongoose')
// Schema
const roomSchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    owner: String
})

// Model
const Room = model('Room', roomSchema)

// Export
module.exports = Room