const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User.model");

const bcrypt = require("bcrypt")


passport.serializeUser((user, next) => {
  next(null, user.id)
})

passport.deserializeUser((id, next) => {
  User.findById(id)
  .then((user) => {
    next(null, user)
  })
  .catch((e) => {
    next(e)
  })
})

passport.use(
  "localAuth",
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (email, password, next) => {
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return next(null, false, { message: 'Incorrect email' });
          }
 
          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: 'Incorrect password' });
          }
 
          next(null, user);
        })
        .catch(err => next(err));
    }
  )
);