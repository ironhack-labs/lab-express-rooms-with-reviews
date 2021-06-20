const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  // passport
  const user = req.user;
  console.log("req.user: ", req.user);
  res.render("index", { user: user });
});

// Passport.js login

const loginCheck = () => {
  return (req, res, next) => {
    // if (req.user)
    if (req.isAuthenticated()) {
      // if user is logged in, proceed to the next function
      next();
    } else {
      // else if user is not logged in, redirect to /login
      res.redirect("/auth/login");
    }
  };
};

router.get("/private", loginCheck(), (req, res) => {
  res.render("private");
});

router.get("/profile", loginCheck(), (req, res) => {
  res.render("profile");
});

module.exports = router;
