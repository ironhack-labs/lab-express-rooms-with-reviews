const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const User = require("../models/User.model")


/* GET users listing. */
router.get('/', async (req, res) => {
  let listUsers = []
  let error = null
  
  try {
      listUsers = await User.find()
  } catch (e) {
      error = { errType: "DB_ERR", message: e }
  } finally {
      res.render('users/users-list', { users: listUsers, error })
  }
})

router.route('/signup')
  .get( (req, res) => {
    res.render('signup-form');
  })
  .post( async (req, res) => {

    const {username, email, password} = req.body

    if (!username || !email || !password) {
      res.render('signup-form', { username, email, error: {type: "CREDENTIALS_ERROR", message: "All fields are required!" }})
    }

    const user = await User.findOne( { username } )
    if (user) {
      res.render("signup-form", { username, email, error: { type: "USER_ERROR", message: "This user already exists!" }})
    }

    const salt = bcrypt.genSaltSync(4)
		const hashedPwd = bcrypt.hashSync(password, salt)

    const newUser = await User.create({ username, email, password: hashedPwd })
    
    if (newUser) {
      res.render("index", { username, email, message: "User created successfully!!" })
    } else {
      res.render("signup-form", { username, email, error: { type: "USER_CREATION_ERROR", message: "This user already exists!" }})
    }

    res.send(req.body)
  })


router.route('/login')
  .get((req, res ) => {
    res.render('login-form')
  })
  .post( async (req, res ) => {
    const {email, password} = req.body 
    if (!email || !password) res.render('login-form', { error: {type: "CREDENTIALS_ERROR", message: "Wrong credentials!" }})

    const loggedInUser = await User.findOne( { email } )
    if (!loggedInUser) {
      res.render('login-form', { error: {type: "USER_ERROR", message: "User is not exists!" }})
    }

    console.log(password, loggedInUser.password)
    const isPwdCorrect = bcrypt.compareSync(password, loggedInUser.password)

    if (isPwdCorrect) {
      // this makes sure we can access the loggedIn user in the session
      //req.session.loggedInUser = loggedInUser
      res.render("index", { user: loggedInUser, message: "You are logged in!" })
    } else {
      res.render('login-form', { error: {type: "USER_ERROR", message: "Password is incorrect!" }})
    }

  })

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) res.redirect('/');
      else res.render('login-form', { message: "You are logged out!" });
  });
});


module.exports = router;
