const router = require('express').Router();

// ℹ️ Handles password encryption
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require('../models/User.model');

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');

// GET to render signup page
router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup');
});

// POST to sign up the user
router.post('/signup', isLoggedOut, (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password) {
    res.status(200).render('auth/signup', {
      errorMessage:
        'All the fileds are mandotory. Please provide ypout email and password for signing up.',
    });
    return;
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email: email }).then((foundEmail) => {
    // If the user is found, send the message username is taken
    if (foundEmail) {
      return res
        .status(400)
        .render('auth/signup', { errorMessage: 'Username already taken.' });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          fullName: fullName,
          email: email,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object

        req.session.user = user;
        // res.redirect('/auth/login')
        res.redirect('/room/list');
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render('auth/signup', { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render('auth/signup', {
            errorMessage:
              'Username need to be unique. The username you chose is already in use.',
          });
        }
        return res
          .status(500)
          .render('auth/signup', { errorMessage: error.message });
      });
  });
});

// GET to render login page
router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login');
});

//POST to let user to login
router.post('/login', isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;
  console.log('IN LOGIN');
  if (!email || !password) {
    return res
      .status(400)
      .render('auth/login', { errorMessage: 'Please provide your username.' });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  // if (password.length < 8) {
  //   return res.status(400).render('auth/login', {
  //     errorMessage: 'Your password needs to be at least 8 characters long.',
  //   })
  // }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      console.log(user);
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render('auth/login', { errorMessage: 'Wrong credentials.' });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render('auth/login', {
            errorMessage: 'Either email or password is not correct',
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.render('index');
      });
    })
    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

// GET to destroy the session
router.get('/logout', isLoggedIn, (req, res) => {
  console.log('destroying the session');
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render('auth/logout', { errorMessage: err.message });
    }
    res.redirect('/');
  });
});

module.exports = router;
