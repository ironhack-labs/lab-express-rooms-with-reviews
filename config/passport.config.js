const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user => next(null, user)))
    .catch(e => next(e))
});

passport.use('local-auth', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, next) => {
  User.findOne({ email: email })
    .then((user) => {
      if(!user) {
        next(null, false, { error: 'Email or password are incorrect' })
      } else {
        return user.checkPassword(password)
          .then((match) => {
            if (match) {
              next(null, user)
            } else {
              next(null, false, { error: 'Email or password are incorrect' })
            }
          })
      }
    })
    .catch(next)
}));

passport.use('google-auth', new GoogleStrategy({
  clientID: process.env.G_CLIENT_ID,
  clientSecret: process.env.G_CLIENT_SECRET,
  callbackURL: process.env.G_REDIRECT_URI || '/users/authenticate/google/callback'
}, (accessToken, refreshToken, profile, next) => {
  const googleID = profile.id;
  const email = profile.emails[0] ? profile.emails[0].value : undefined;

  if (googleID && email) {
    User.findOne({
      $or: [
        { email: email },
        { googleID: googleID }
      ]
    })
      .then((user) => {
        if (!user) {
          const newUserInstance = new User ({
            email: email,
            googleID: googleID,
            password: mongoose.Types.ObjectId()
          })

          return newUserInstance.save()
            .then((newUser) => {
              next(null, newUser)
            })
        } else {
          next(null, user)
        }
      })
      .catch(next)
  } else {
    next(null, false, { error: 'Error connecting with Google Auth' })
  }
}))