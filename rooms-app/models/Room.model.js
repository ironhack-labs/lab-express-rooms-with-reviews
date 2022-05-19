const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
    {
        name: { 
            type: String,
            require: true
         },
        description: String,
        imageUrl: String,
        owner: {
            type: Schema.Types.ObjectId, 
            ref: "User" 
        },
        reviews: [] 
    }
);

const Room = model("Room", roomSchema);

module.exports = Room;
