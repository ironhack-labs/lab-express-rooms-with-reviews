const express = require('express');
const router  = express.Router();
const User = require('../models/user')
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* GET home page */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post("/signup", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.username;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (email === "" || password === "") {
        res.render("signup", {
            errorMessage: "Please enter Email and Password!"
        });
        return;
    }

    User.findOne({ "email": email })
        .then(user => {
            if (user !== null) {
                res.render("signup", {
                    errorMessage: "The email already exists!"
                });
                return;
            }
            User.create({
                email,
                password: hashPass,
                fullName
            })
                .then(() => {
                    res.redirect("/");
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            next(error);
        })
});

/* SignIn Page */
router.get('/signin', (req, res, next) => {
    res.render('signin.hbs');
});



router.post("/signin", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === "" || password === "") {
        res.render("signin", {
            errorMessage: "Please enter both, email and password to sign in."
        });
        return;
    }

    User.findOne({ "email": email })
        .then(user => {
            if (!user) {
                res.render("signin", {
                    errorMessage: "The email doesn't exist."
                });
                return;
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect("/");
            } else {
                res.render("signin", {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(error => {
            next(error);
        })
});

router.get("/signout", (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});

module.exports = router;
