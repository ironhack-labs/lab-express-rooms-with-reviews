const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { email, password, fullName } = req.body;
  const newUser = new User({ email, password, fullName });
  newUser.save(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
