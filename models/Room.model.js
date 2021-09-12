const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { 
        type: String,
        default; 'https://images.unsplash.com/photo-1584467331242-9628400008cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=634&q=80'
     },
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: "User" 
    },
    reviews: [] // we will update this field a bit later when we create review model
  });

  const Room = model("Room", roomSchema);

module.exports = Room;