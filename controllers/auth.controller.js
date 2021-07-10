const User = require('../models/user.model');
const mongoose = require('mongoose');
const passport = require('passport');

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email', 
  'https://www.googleapis.com/auth/userinfo.profile'
];

module.exports.register = (req, res, next) => {
  res.render('auth/register')
};

module.exports.doRegister = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        User.create(req.body)
          .then(() => {
            res.redirect('/')
          })
          .catch((e) => {
            if (e instanceof mongoose.Error.ValidationError) {
              res.render('auth/register', { user: req.body, errors: e.errors })
            } else {
              next(e)
            }
          })
      } else {
        res.render('auth/register', { user: req.body, errors: {email: 'This email is already registered'} })
      }
    })
    .catch(e => next(e))
};

module.exports.login = (req, res, next) => {
  res.render('auth/login')
};

module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('auth/login', { user: req.body, errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          res.redirect('/')
        }
      })
    }
  })(req, res, next)
};

// module.exports.loginGoogle = (req, res, next) => {
//   passport.authenticate('google-auth', { scope: GOOGLE_SCOPES })
// };

module.exports.doLoginGoogle = (req, res, next) => {
  passport.authenticate('google-auth', (error, user, validations) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.status(400).render('auth/login', { user: req.body, error: validations })
    } else {
      req.login(user, (loginErr) => {
        if (loginErr) {
          next(loginErr)
        } else {
          res.redirect('/')
        }
      })
    }
  })(req, res, next)
}