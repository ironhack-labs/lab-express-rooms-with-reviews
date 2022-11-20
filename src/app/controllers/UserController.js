import User from "../models/User.js";

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ erro: "Usuário já existe." });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    return res.json({ ok: "true" });
  }
}

export default new UserController();
