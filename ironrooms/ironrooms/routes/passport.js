const express = require('express');
const router  = express.Router();
const User = require("../models/user");

const bcrypt     = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (reg, res, next) => {
    res.render('auth/signup');
});

router.get("/login", (req, res, next) => {
    res.render("auth/login");
});

router.post("/signup", (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (!email)
    return res.render("auth/signup", { message: "Username can't be empty" });

    if (!password)
    return res.render("auth/signup", { message: "Password can't be empty" });

    User.findOne({ email: email })
      .then(user => {
        if(user)
            return res.render('auth/signup', {
                errorMessage: "The email already exists!"
            });

            bcrypt
            .genSalt()
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => User.create({ email: email, password: hash, fullName: fullName }))
            .then(newUser => {
              console.log(newUser);
              req.session.currentUser = newUser; // add newUser to session
              res.redirect("/");
            });
        })
        .catch(err => next(err));
    });

router.post("/login", (req, res, next) => {
    const theEmail = req.body.email;
    const thePassword = req.body.password;
    const theFullName = req.body.fullName;
    if (theEmail === "" || thePassword === "" || theFullName === "") {
        res.render("auth/login", {
            errorMessage: "Please enter both, username and password to sign up."
        });
        return;
    }

    User.findOne({ "email": theEmail })
        .then(user => {
            if (!user) {
                res.render("auth/login", {
                    errorMessage: "The username doesn't exist."
                });
                return;
            }
            if (bcrypt.compareSync(thePassword, user.password)) {
                // Save the login in the session!
                req.session.currentUser = user;
                console.log('session opened', req.session);
                res.redirect("/main");
            } else {
                res.render("auth/login", {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(error => {
            next(error);
        })


});

router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});


module.exports = router;