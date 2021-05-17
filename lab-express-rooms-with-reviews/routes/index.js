const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10 // SALTI

/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;

  if (!user) {
    res.redirect("/login");
    return
  }

  res.render('index', {
    user: req.session.currentUser
  });
});



//login GET
router.get('/login', (req, res) => {
  res.render('auth/login');
})


//Signup GET
router.get('/signup', (req, res) => {
  res.render('auth/register');
})

//Signup Post
router.post('/signup', (req, res) => {
  const {
    username,
    email,
    password
  } = req.body


  bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashed => {
      return User.create({
        username,
        email,
        passwordHash: hashed
      })
    }).then(user => {
      console.log(user);
      req.session.currentUser = user;
      console.log(req.session.currentUser);
      res.redirect('/')
    }).catch(e => {
      console.log(e);
    })



})

//login post
router.post('/login', (req, res) => {

  const {

    email,
    password
  } = req.body

  User.findOne({
      email
    })
    .then(usuario => {
      if (!usuario) {
        res.render('auth/login', {
          error: "el usuario no esta"
        })
        return
      } else if (bcryptjs.compareSync(password, usuario.passwordHash)) {

        req.session.currentUser = usuario
        res.redirect('/')
        return

      } else {
        res.render('index', {
          error: "pasword incorrecto"
        })
        return
      }



    }).catch(e => {
      next(e)
    })

})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});



module.exports = router;