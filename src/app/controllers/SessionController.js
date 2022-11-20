import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import authConfig from "../../config/auth.js";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const validPassword = await bcrypt.compareSync(password, user.password);

    if (!user) {
      return res.status(400).json({ error: "Usuário não existe." });
    }

    if (!(await validPassword)) {
      return res.status(400).json({ error: "Senha incorreta." });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async destroy(req, res) {
    return res.json({ ok: true });
  }
}

export default new SessionController();
