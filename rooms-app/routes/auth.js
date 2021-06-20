const express = require("express");
const bcrypt = require("bcrypt");

// Passport.js login
const passport = require("passport");

const router = express.Router();
const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.get("/login", (req, res) => {
  res.render("auth/login", { errorMessage: req.flash("error") });
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.post("/signup", (req, res, next) => {
  const { email, password, fullName } = req.body;

  if (password.length < 8) {
    res.render("auth/signup", {
      message: "Your password must be 8 characters minimun.",
    });
    return;
  }
  if (email === "") {
    res.render("auth/signup", { message: "Your email cannot be empty" });
    return;
  }

  User.findOne({ email: email }).then((found) => {
    if (found !== null) {
      res.render("auth/signup", { message: "This email is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash,
        fullName: fullName,
      })
        .then((dbUser) => {
          // res.redirect('login');
          req.login(dbUser, (err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/");
            }
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/login", // here you would redirect to the login page using traditional login approach
  })
);

router.get("/logout", (req, res, next) => {
  // passport
  req.logout();
  res.redirect("/");
});

module.exports = router;
