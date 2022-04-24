const router = require('express').Router(); 
const User = require('../models/User.model');
const Room = require('../models/Room.model');
const Review = require('../models/Review.model');
const mongoose = require('mongoose');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


// **** RENDER ROOM CREATE VIEW IF LOGGED IN **** //
router.get('/room-create', isLoggedIn, (req, res, next) => {
  res.render('room-views/room-create.hbs');
});


// **** RENDER LIST OF ROOMS VIEW WHEN REQUESTED **** //
router.get('/room-list', (req, res, next) => {

  Room.find()
  .populate('owner reviews')
  .populate({
    path: 'reviews',
    populate: {
      path: 'user',
      model: 'User'
    }
  })
  .then(roomsFound => {
    res.render('room-views/room-list.hbs', { rooms: roomsFound });
  })
  .catch(err => console.log(err));
});


// **** RENDER EDIT ROOM VIEW UPON REQUEST IF ROOM OWNER**** //
router.get('/room-edit/:id', (req, res, next) => {
  const roomId = req.params.id
  const sessionId = (req.session.currentUser._id)


  Room.findById(roomId)
  .populate('owner')
  .then(roomFound => {
    if (roomFound.owner.id === sessionId) {
      res.render ('room-views/room-edit', { room: roomFound } )
    } else {
      console.log('No match on owner, back to rooms list')
      res.redirect('/room-list')
    }
  })
  .catch(err => console.log(err));
})


// **** HANDLE ROOM CREATION REQUESTS **** //
router.post('/room-create', (req, res, next) => {
  console.log(req.session);
  const { name, description, imageUrl } = req.body
  const ownerId = req.session.currentUser._id

  Room.create({name, description, imageUrl, owner: ownerId})
    .then(roomCreated => {
      console.log(`Room ${roomCreated.name} created`)
      res.redirect('/room-list')
    })
    .catch(err => console.log(err));
})


// **** HANDLE ROOM UPDATES **** //
router.post('/room-edit/:id', (req, res, next) => {
  const roomId = req.params.id
  const { name, description, imageUrl } = req.body

  Room.findByIdAndUpdate( roomId, { name, description, imageUrl }, {new: true} )
    .then(roomUpdated => {
      console.log(`Room name: ${roomUpdated.name} updated..`)
      res.redirect('/room-list')
    })
    .catch(err => console.log(err));
})


// **** ALLOW DELETE REQUEST IF ROOM OWNER **** //
router.get('/delete/:id', (req, res, next) => {
  const roomId = req.params.id
  const sessionId = (req.session.currentUser._id)
 
  Room.findById(roomId)
  .populate('owner')
  .then(roomFound => {
    if (roomFound.owner.id === sessionId) {
      Room.findByIdAndDelete(roomId)
        .then(roomRemoved => {
          console.log (`Room: ${roomRemoved.name} has been removed`)
          res.redirect('/room-list')
        })
        .catch(err => console.log(err));

    } else {
      console.log('No match on owner, back to rooms list')
      res.redirect('/room-list')
    }
  })
  .catch(err => console.log(err));
})


module.exports = router; // <- we export our router