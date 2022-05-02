const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  const { email, password } = req.body;

  // bcrypt hashing then save to database
  bcryptjs
    .hash(password, 10)
    .then((hashedPassword) => {
      //  cant use shorthand this way
      User.create({ email, password: hashedPassword }).then((userfromDB) => {
        console.log('new user', userfromDB);
        res.redirect('signup');
      });
    })
    .catch((err) => {
      console.log(err);
      res.send('failure');
    });
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  //  if we do post we gotta find the values in body.
  const { email, password } = req.body;
  // find user in db based on their username
  // use bcryptjs to comapre password after we find user in db

  // set user within the session if login is successful
  User.findOne({ email })
    .then((user) => {
      bcryptjs.compareSync(password, user.password);

      req.session.currentUser = user;
      res.redirect('/userProfile');
    })
    .catch((error) => next(error));
});

router.get('/userProfile', (req, res, next) => {
  console.log(req.session);
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;
