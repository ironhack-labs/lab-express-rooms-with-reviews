const router = require('express').Router(); 
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs'); 
const mongoose = require('mongoose');


const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// **** HANDLE USER UPDATES **** //
router.post('/edit/:id', (req, res, next) => {
  const { fullName, email } = req.body
  const userId = req.params.id
  console.log(fullName, email)
  
  User.findByIdAndUpdate(userId, { fullName, email })
    .then(userChanged => {
      console.log(userChanged)
    })
    .catch(error => next(error));

});


// *** RENDER SIGNUP VIEW *** //
router.get('/signup', (req, res, next) => res.render('auth-views/auth-signup'));


// *** RENDER LOGIN VIEW *** //
router.get('/login', (req, res, next) => res.render('auth-views/auth-login'));


// *** RENDER PROFILE VIEW ONCE LOGGED IN *** //
router.get('/profile/:id', (req, res, next) => {
  const userId = req.params.id

  User.findById(userId)
    .then(userFound => {
        console.log(userFound)
        res.render('auth-views/auth-profile',  { userFound } );
    })
    .catch(error => next(error));
})
  
  
// *** HANDLE SIGNUP - CREATE USER *** //
router.post('/signup', (req, res, next) => {
  const {fullName, email, password} = req.body

  if (!fullName || !email || !password) {
    res.render('auth-views/auth-signup', { errorMessage: 'Ensure all fields are populated' });
    return;
  }

  bcryptjs
    .hash(password, 10)
    .then(hashedPassword => {
        return User.create({ fullName, email, password: hashedPassword });
    })
    .then(userCreated => {
      console.log(`Created new user:`, userCreated)
      res.render('auth-views/auth-login', { user: userCreated });
    })
    .catch(error => {
      console.log('Error creating new user');
    })
});


// *** HANDLE LOGIN *** //
router.post('/login', (req, res, next) => {
  const { email, password } = req.body

  if (email === '' || password === '') {
    res.render('auth-views/auth-login', { errorMessage: 'Please enter both, username and password'});
    return;
  }

  User.findOne({email})
    .then(user => {
      if (!user) {
        res.render('auth-views/auth-login', { errorMessage: 'User not found.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect(`/profile/${user._id}`);
      } else {
        res.render('auth-views/auth-login.hbs', { errorMessage: 'invalid password' });
      }
    })
    .catch(error => next(error));
});


// *** HANDLE LOGOUT *** //
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});





module.exports = router; // <- we export our router