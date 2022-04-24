const router = require('express').Router(); 
const User = require('../models/User.model');
const Room = require('../models/Room.model');
const Review = require('../models/Review.model');
const mongoose = require('mongoose');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


// **** RENDER REVIEW-CREATE VIEW UPON REQUEST IF NOT ROOM OWNER**** //
router.get('/review-create/:id', (req, res, next) => {
  const roomId = req.params.id
  const sessionId = (req.session.currentUser._id)

  Room.findById(roomId)
  .populate('owner')
  .then(roomFound => {
    if (roomFound.owner.id === sessionId) {
      console.log('Owner match, cannot create comments for own rooms')
      res.redirect('/room-list')
    } else {
      res.render ('comment-views/review-create', { room: roomFound, author: sessionId } )
    }
  })
  .catch(err => console.log(err));
})


// **** HANDLE REVIEW/COMMENT CREATION **** //
router.post('/review-create/:id', (req, res, next) => {
  const roomId = req.params.id
  const { user, comment } = req.body

  Review.create({ user, comment })
    .then(reviewCreated => {
      return Room.findByIdAndUpdate(roomId, { $push: { reviews: reviewCreated._id} })
    })
    .then(() => res.redirect('/room-list'))
    .catch(err => console.log(err));
})


// **** RENDER REVIEW-EDIT VIEW UPON REQUEST IF REVIEW OWNER**** //
router.get('/review-edit/:id', (req, res, next) => {
  const reviewId = req.params.id
  const sessionId = (req.session.currentUser._id)
  console.log(sessionId)

  Review.findById(reviewId)
  .then((reviewFound) => {
    if (String(reviewFound.user) === sessionId) {
      res.render ('comment-views/review-edit', { review: reviewFound} )
    } else {
      console.log('Owner does not match, cannot edit or delete')
      res.redirect('/room-list')
    }
  })
})


// **** HANDLE REVEIW UPDATES ****//
router.post('/review-edit/:id', (req, res, next) => {
  const reviewId = req.params.id
  const { comment } = req.body

  Review.findByIdAndUpdate(reviewId, { comment })
  .then(() => res.redirect('/room-list'))
  .catch(err => console.log(err))
})


// **** HANDLE REVIEW DELETES IF REVIEW OWNER ****//
router.get('/review-delete/:id', (req, res, next) => {
  const reviewId = req.params.id
  const sessionId = (req.session.currentUser._id)

  Review.findById(reviewId)
  .then((reviewFound) => {
    if (String(reviewFound.user) === sessionId) {
      Review.findByIdAndDelete(reviewFound._id)
      .then(() => {
        res.redirect('/room-list')
      })
    } else {
      console.log('Owner does not match, cannot edit or delete')
      res.redirect('/room-list')
    }
  })
})

module.exports = router; // <- we export our router