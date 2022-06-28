const mongoose = require('mongoose');
const {Router} = require ('express')
const router = new Router()
const bcryptjs = require('bcryptjs')
const saltRounds =10
const User = require ('../models/User.model')
// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// GET route ==> to display the signup form to users
router.get ('/signup', isLoggedOut, (req,res) => res.render('auth/signup.hbs'))

// POST route ==> to process form data
router.post('/signup', isLoggedOut, (req, res, next) => { 
console.log(req.body)
const {fullName, email, password} =req.body;

// make sure users fill all mandatory fields:
if (!fullName || !password || !email) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your full name, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then (hashedPassword => {
  console.log(`Password hash: ${hashedPassword}`)
  return User.create ({
    fullName, 
    email,
    password: hashedPassword
  })
})
.then(userFromDB =>{
    console.log('Newly created user is: ', userFromDB);
    res.redirect('views/users/user-profile');  
}) 
.catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', {
         errorMessage: 'Full name needs to be unique. Full name is already used.'
      });
    } else {
      next(error);
    }
  })
})

//////////// L O G I N ///////////

// GET route ==> to display the login form to users
router.get('/login', isLoggedOut, (req, res) => res.render('login'));

// POST login route ==> to process form data
router.post('/login', isLoggedOut, (req, res, next) => {
    console.log('SESSION =====> ', req.session);
    const {fullName, email, password} = req.body;
    if (!fullName || !password || !email) {
        res.render('login', {
          errorMessage: 'Please fill all the fealds to login.'
        });
        return;
    }
    User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('login', { errorMessage: 'Full name is not registered. Try with other full name.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        //res.render('users/user-profile', { user });
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
})

router.get ('/userProfile', isLoggedIn, (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser})
})

router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy();
      res.redirect('/');
    }); 
    

 
module.exports = router