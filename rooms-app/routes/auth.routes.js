// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const passport = require('passport');

const mongoose = require('mongoose');


router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      // Something went wrong authenticating user
      return next(err);
    }
    if (!theUser) {
      // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      res.render('auth/login', { errorMessage: 'Wrong password or username' });
      return;
    }
    // save user in session: req.user
    req.login(theUser, err => {
      if (err) {
        // Session save went bad
        return next(err);
      }
      // All good, we are now logged in and `req.user` is now set
      res.redirect('/');
    });
  })(req, res, next);
});

router.post('/signup', async (req,res,next) =>{
const { username, email, fullName, password } = req.body;
    if(!username || !password){
        res.render('auth/signup', { errorMessage: 'Required field missing', attempt: {username,fullName,email} });
        return;
    }
    try{
        const hashed =  await saltPassword(password);
        const newUser = await User.create({username,email,fullName,passwordHash:hashed});
        console.log('User created ', newUser);
        res.render('auth/login',{successMessage: `${username} created!  You can now login below`});
    }catch (err){
        if (err instanceof mongoose.Error.ValidationError) {
             res.status(500).render('auth/signup', { errorMessage: err.message, attempt: {username,fullName,email}});
        } else if (err.code === 11000) {
             res.status(500).render('auth/signup', {
            errorMessage: 'Username already in use - must be unique.'
        });
        }
        console.log('Failed to create user ',err);
        next(err);
    }
});

router.get('/main' ,(req, res, next) => res.render('main',{ userSession: req.session.currentUser }));

router.get('/private', (req, res, next) => res.render('private',{ userSession: req.session.currentUser }));


async function saltPassword(password){
    try{
        const hashedPassword = await bcryptjs.hash(password,saltRounds);
        console.log(hashedPassword);
        return hashedPassword;
    }catch{
        console.log('Failed to encrypt PW - dying');
    }
}

module.exports = router;