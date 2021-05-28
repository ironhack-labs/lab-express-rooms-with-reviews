const {Router} = require('express')
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Room = require('../models/Room.model');
const Review = require('../models/Reviews.model');
const { findByIdAndUpdate, findById } = require('../models/User.model');

router.get('/user-rooms', async (req, res, next) => {

    const availableRooms = await Room.find({}).populate('reviews owner')
    console.log(availableRooms)
    res.render('user/rooms', {
      valueCookie:req.session.currentUser,
      activeRooms:availableRooms,
    })
  
})

router.get('/create-room', (req, res, next) => {
  if(req.session.currentUser) {
    res.render('user/createRoom',
    {
      valueCookie:req.session.currentUser
    })
  }
  
});

router.post('/create-room', async (req, res, next) =>{
  const { name, description, imageURL, ownerID } = req.body
  
  try {
      const newRoom = await Room.create({ name, description, imageURL })
      await Room.findByIdAndUpdate(newRoom.id, { $push: { owner: ownerID } })
      console.log('create un Room')
      res.redirect('/user-rooms')
  } catch (err) { next(err)}
  
});


router.get('/user-rooms/:id/edit', async(req, res, next) => {
  if (req.session.currentUser){
      const id = req.params.id

      const roomEdit = await Room.findById(id);
      res.render('user/editRoom', {
        roomToEdit: roomEdit,
        valueCookie:req.session.currentUser
      })
    }
});

router.post('/user-rooms/:id/edit', async(req, res, next) => {
  const id = req.params.id
  const { name, description, imageURL, ownerID } = req.body

  const roomEdit = await Room.findByIdAndUpdate(id, { $set: { name, description, imageURL }}, {new:true});
  
  res.redirect('/user-rooms')
});

router.post('/user-rooms/:id/delete', async(req, res, next) => {
  const id = req.params.id;
  await Room.findByIdAndDelete(id)
  console.log('Room',id,'was deleted')
  res.redirect('/user-rooms')
})

router.post('/user-rooms/:id/add-review', async(req,res,next) => {
  if(req.session.currentUser) {
    const {comment,ownerID,roomID} = req.body
    const id = req.params.id
    console.log(ownerID)
    const addedComment = await  Review.create({comment,ownerID});
    console.log(addedComment)
    await Review.findByIdAndUpdate(addedComment.id, { $push: { user: ownerID } })
    await Room.findByIdAndUpdate(roomID, { $push: { reviews: addedComment.id } })
    res.redirect('/user-rooms')
  }
    

})

module.exports = router