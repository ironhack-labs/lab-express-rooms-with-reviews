const mongoose = require('mongoose');
const express = require('express');
const router  = express.Router();
const Room = require('../models/Room.model.js')
const Review = require('../models/Review.model.js')



router.get('/rooms',  (req, res, next) => {
  res.render('room/rooms',{userInSession: req.session.currentUser}) 
});



router.post('/createRoom',  async (req, res, next) => {
  const {name,description ,imageUrl} = req.body
  const {fullName} = req.session.currentUser

  const newRoom = await Room.create({name,description,imageUrl,owner:fullName})
  console.log(newRoom)
  res.redirect("/viewRooms")
});


router.get('/viewRooms', async (req, res, next) => {
  Room.find({})
  .then((roomDB) => {
      console.log(roomDB)
      res.render('room/rooms-list' , {roomDB}) 
  })
});


router.get('/deleteRoom/:id', (req, res, next) => {
  const id = req.params.id
  console.log(id)
  Room.findByIdAndDelete(id)
  .then(cuarto =>{
    console.log(cuarto)
    res.redirect("/viewRooms")
  })
  .catch(error =>{
    console.log(error)
  })
    
  
});






module.exports = router;