const{Router} = require('express')
const router = new Router();
const bcrypt = require('bcrypt')
const saltRounds = 10
const mongoose = require('mongoose');
const User = require('../models/User.model');

router.get('/signup', (req,res,next)=>{
  res.render('singup')
})

router.post('signup', async(req,res,next)=>{
    const{email,password} = req.body;

    try{
      const newUser = await User.create
    }catch(){

    }
})