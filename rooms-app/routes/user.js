const mongoose = require('mongoose');
const express = require('express');
const router  = express.Router();
const User = require('../models/User.model.js')
const bcrypt = require("bcrypt")
const saltRounds = 10




router.get("/signup" , (req,res,next)=>{
  res.render("user/signup")
})

router.post("/signup" , async (req,res,next)=>{
 const {fullName, email , password} = req.body

 if(!fullName||!email||!password){
   res.render("user/signup",{errorMessage : "Llena todos los datos"})
 }

 const genResult = await bcrypt.genSalt(saltRounds)
 const passwordHash = await bcrypt.hash(password,genResult)
 const newUser = await User.create({fullName, email, passwordHash})
 res.redirect("/login")
})

router.get("/login" , (req,res,next)=>{
  res.render("user/login" , {userInSession: req.session.currentUser})
})

router.post("/login" , async (req,res,next)=>{
  const {email , password } = req.body
  
  if(!email||!password){
      res.render("user/login",{errorMessage : "TODOS LOS CAMPOS PORFAVOR"})
  }

  const userDB = await User.findOne({email})
  if(!userDB){
      res.render("user/login",{errorMessage: "Este usuario no existe"})
  }
  const match = await bcrypt.compareSync(password , userDB.passwordHash)
  console.log(match)
  if(match){
      req.session.currentUser = userDB 
      console.log("ESTO ME IMPRIME LA COOKIE ====>", req.session.currentUser)
      res.redirect("/login")
  }else{
      res.render("user/login",{ errorMessage : "Contraseña incorrecta"})
  }  
})

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});










module.exports = router;