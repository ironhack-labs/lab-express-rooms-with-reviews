// Importación.
const { Schema, model } = require("mongoose")

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
    owner: {
        type: String
    }
})

// Modelo
const Room = model("Room", roomSchema)

// Exportación
module.exports = Room