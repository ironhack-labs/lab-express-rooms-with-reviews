import User from "../models/User.js";
import Room from "../models/Room.js";

class RoomController {
  async store(req, res) {
    const imageUrl = req.file.path;
    const { name, description, email } = req.body;
    const user = await User.findOne({ email });
    const owner = user._id;

    const room = await Room.create({
      name,
      description,
      owner,
      imageUrl,
    });

    return res.json(room);
  }

  async show(req, res) {
    const rooms = await Room.find({});
    return res.json({ rooms });
  }

  async update(req, res) {
    const imageUrl = req.file.path;
    const { name, description, email } = req.body;
    const user = await User.findOne({ email });
    const room = await Room.findOne({ name });
    if (!user._id.equals(room.owner)) {
      return res
        .status(403)
        .json({ erro: "Usuário não tem acesso ao quarto." });
    }

    await Room.updateOne(
      { _id: room._id },
      {
        name,
        description,
        imageUrl,
      }
    );

    return res.send("Updated Successfully");
  }

  async destroy(req, res) {
    const { name, email } = req.body;
    const user = await User.findOne({ email });
    const room = await Room.findOne({ name });
    if (!user._id.equals(room.owner)) {
      return res
        .status(403)
        .json({ erro: "Usuário não tem acesso ao quarto." });
    }

    await Room.deleteOne({ name });

    return res.send("Deleted Successfully");
  }
}

export default new RoomController();
