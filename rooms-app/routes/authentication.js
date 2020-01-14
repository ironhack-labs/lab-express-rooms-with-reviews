const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("authentication/signup");
});

router.get("/login", (req, res) => {
  res.render("authentication/login");
});

router.post("/signup", (req, res, next) => {
    const { email, password, fullname} = req.body;
    const passwordLength = 7;
    console.log("show me the request: ", req.body);
    if (!password)
        return res.render("authentication/signup", { message: "Password can't be empty" });

  if (password.length < passwordLength)
    return res.render("authentication/signup", {
      message: `Password length should be not less than ${passwordLength}`
    });

  User.findOne({ email })
    .then(foundUser => {
      if (foundUser)
        return res.render("authentication/signup", {
          message: `email ${foundUser.email} is already in use`
        });

      bcrypt
        .genSalt()
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ email: email, password: hash, fullname: fullname }))
        .then(newUser => {
          console.log(newUser);
          req.session.user = newUser;
          res.redirect("/");
        });
    })
    .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  console.log("request incoming")
  User.findOne({ email })
    .then(foundUser => {
      console.log(foundUser)
      if (!foundUser)
        return res.render("authentication/signup", {
          message: `${email} not found. Please signup!`
        });

      bcrypt.compare(password, foundUser.password).then(exist => {
        if (!exist)
          return res.render("authentication/login", {
            message: "Invalid credentials"
          }); 
        
        req.session.user = foundUser;
        res.redirect("/private");
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.clearCookie("connect.sid");
      res.redirect("/");
    }
  });
});

module.exports = router;
