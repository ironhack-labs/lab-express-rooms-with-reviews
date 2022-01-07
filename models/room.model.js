const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: String,
    description: String,
    imageUrl: {
        type: Schema.Types.ObjectId,
        ref: "Picture"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: []
})

module.exports = model('Room', roomSchema)