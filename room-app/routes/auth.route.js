const {Router} = require('express')
const router = new Router();
const bcrypt = require('bcrypt')
const saltRounds = 10
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})

router.post('/signup', async(req,res,next)=>{
    const{ email, password } = req.body;

    try{

      const saltRoundgen = await bcrypt.genSalt(saltRounds)
      const passwordHash = await bcrypt.hash(password,saltRoundgen)
      const newLogin =  await User.create ({
        email, passwordHash
      });
      req.session.currentUser = newLogin;
      res.render('welcome', {
        valueCookie:req.session.currentUser
      })
    }catch(error){
      next(error)
    }
})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
  }
);



router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if(email === "" || password === "") {
    res.render('auth/login', {errorMessage:"Please fill all the login information"})
  };


  try {
    const newLogin = await User.findOne({email});
    console.log(newLogin)
    if (!newLogin) {
      res.render('auth/login', { errorMessage: "el usuario no fue encontrado"})
      return;
    } else if (bcrypt.compareSync(password,newLogin.passwordHash)) {
      req.session.currentUser = newLogin;
      res.redirect('/user-rooms')
    } else {
      res.render('auth/login', { errorMessage: 'Password incorrecto'})
    }
  }
  catch (err) {
    next(err)
  }
});


router.post('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/')
})


module.exports = router