const User = require('../models/user.model');
const mongoose = require('mongoose');

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