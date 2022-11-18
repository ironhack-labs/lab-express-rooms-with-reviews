import { Schema, model } from "mongoose";

const RoomSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Room", RoomSchema);
