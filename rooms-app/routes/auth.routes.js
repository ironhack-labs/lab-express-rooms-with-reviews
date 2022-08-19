const router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User.model");
const Room = require("../models/Room.model");
const Review = require("../models/Review.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// HOME  ***********************************************
router.get("/", (req, res, next) => {
  const id = req.session.currentUser;
  console.log(id._id);
  Room.find()
    .then((foundRooms) => {
      let newArr = foundRooms.filter(
        (element) => element.owner.toString() !== id._id
      );
      res.render("index", { newArr });
    })
    .catch((err) => console.log(err));
});

// SIGNUP ***********************************************
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;
  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      // console.log('Newly created user is: ', userFromDB);
      req.session.currentUser = userFromDB;
      res.render("auth/login");
    })
    .catch((error) => console.log(error));
});

// LOGIN  ***********************************************
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  // Check for empty fields
  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/auth/profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((err) => console.log(err));
});

// PROFILE  ***********************************************
router.get("/profile", isLoggedOut, (req, res, next) => {
  const { _id } = req.session.currentUser;

  Room.find({ owner: _id })
    .then((foundRooms) => {
      if (req.session.currentUser) {
        const { username } = req.session.currentUser;
        res.render("auth/profile", { username, foundRooms });
      } else {
        res.render("auth/profile");
      }
    })
    .catch(() => console.log(err));
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("connect.sid");
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
