const mongoose = require('mongoose');
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const Review = require('../models/Review.model');
const router = require('express').Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');

// GET to show review form
router.get('/create/:roomId', (req, res) => {
  const { roomId } = req.params;
  res.render('reviews/new-review', { roomId });
});

// POST to pubslish a review
router.post('/create', isLoggedIn, async (req, res) => {
  const { comment, roomId } = req.body;
  const foundRoom = await Room.findById(roomId);
  const roomOwnerId = foundRoom.owner;
  let user = req.session.user?._id; // plain string, right?
  if (roomOwnerId != user) {
    user = mongoose.Types.ObjectId(user);
    Review.create({ comment, user })
      .then((createdReview) => {
        return Room.findByIdAndUpdate(
          roomId,
          {
            $push: { reviews: createdReview._id },
          },
          {
            new: true,
          }
        );
      })
      .then((updatedRoom) => {
        console.log('UPDATED ROOM', updatedRoom);
        res.redirect(`/room/show/${roomId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    req.session.errorReview = 'You cannot write review for your own room';
    res.redirect(`/room/show/${roomId}`);
  }
});

module.exports = router;
