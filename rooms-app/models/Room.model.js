const {
    Schema,
    model
} = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
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
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [] // we will update this field a bit later when we create review model
});

const Room = model("Room", roomSchema);

module.exports = Room;