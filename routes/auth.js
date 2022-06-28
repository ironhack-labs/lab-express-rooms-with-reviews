const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const room = require("../models/room.model");
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');
const router = Router();

const saltRounds = 14;



router.get("/signup", async (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("/auth/signup", {
      errorMessage: " provide a username and password",
    });
  }
  const hash = bcryptjs.hashSync(password);
  await User.create({ username, password: hash });
  res.redirect("/signin");
});

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});




const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if (!regex.test(password)) {
  res.status(400).render('auth/signup', {
    errorMessage:
      'The password must contain uppercase and lowercase letter, digits and be at least 6 characters long',
  });
  return;
}



router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render("/auth/signin", {
      errorMessage: "Please provide a username and password",
    });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("/auth/signin", {
      errorMessage: "user not found",
    });
  }
  if (!bcryptjs.compareSync(password, user.password)) {
    return res.render("/auth/signin", {
      errorMessage: "invalid values",
    });
  }

  
  req.session.user = user;
  res.redirect("/users/profile");
});

router.get("/signout", async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
});

module.exports = router;