//imports - modelo de Rooms
const { Schema, model} = require('mongoose')
//Schema
const roomSchema = new Schema({
    name: { 
        type: String },
    description: { 
        type: String },
    imageUrl: { 
        type: String },
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: "User" },
    reviews: [] // we will update this field a bit later when we create review model
  });

  //Model
  const Room = model('Room', roomSchema)

  //exports
  module.exports = Room