const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const passport = require("passport")

const User = require("../models/User.model");

module.exports.signUp = (req, res, next) => {
  res.render('auth/signup')
}

module.exports.doSignUp = (req, res, next) => {
  const { email, password, fullname } = req.body;
  console.log(req.body)

  // 1. Check email, fullname and password are not empty
  if (!email || !password || !fullname) {
    res.render('auth/signup', { 
      errorMessage: 'Indicate username, fullname and password',
      email: email,
      fullname: fullname, 
  });
    return;
  }

  User.findOne({ email: email })
    .then(user => {
      // 2. Check user does not already exist
      if (user !== null) {
        res.render('auth/signup', { message: 'The email already exists' });
        return;
      }

      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      //
      // Save the user in DB
      //

      const newUser = new User({
        email,
        fullname,
        password: hashPass
      });

      newUser
        .save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
    })
    .catch(err => next(err));
}


module.exports.login = (req, res, next) => {
  res.render("auth/login")
}


module.exports.doLogin = ('localAuth', passport.authenticate('localAuth', { failureRedirect: '/auth/login', successRedirect: '/auth/myprofile' }));

module.exports.logout = (req, res) => {
  req.logout();
  res.redirect("/")
}