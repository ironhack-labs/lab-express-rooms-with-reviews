const Room = require('../models/Room.model');
const User = require('../models/User.model');
const router = require('express').Router();

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');
const Review = require('../models/Review.model');

//GET to show the main room
router.get('/', (req, res) => {
  res.render('rooms/main-room');
});

//GET to show all the rooms
router.get('/list', (req, res) => {
  Room.find()
    .then((foundRooms) => {
      res.render('rooms/list-room', { foundRooms });
    })
    .catch((err) => {
      console.log('Users were not found or smth went wrong', err);
    });
});

//GET to render 1 room
router.get('/show/:id', (req, res) => {
  const errorMessage = req.session?.error;
  const errorDeletion = req.session?.errorDeletion;
  const errorReview = req.session.errorReview;
  const { id } = req.params;

  Room.findById(id)
    .populate({
      path: 'owner',
      path: 'reviews',
      populate: {
        path: 'user',
        // model: 'User',
      },
    })
    .then((foundRoom) => {
      console.log(foundRoom);
      res.render('rooms/room', {
        foundRoom,
        errorMessage,
        errorDeletion,
        errorReview,
      });
      delete req.session.error;
      delete req.session.errorDeletion;
      delete req.session.errorReview;
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST to DELETE the room
router.post('/delete/:roomId', isLoggedIn, async (req, res) => {
  const { roomId } = req.params;
  try {
    const foundRoom = await Room.findById(roomId);
    const roomOwner = foundRoom.owner.toString();
    const currentUserId = req.session.user?._id;
    if (currentUserId === roomOwner) {
      await Room.findByIdAndRemove(roomId);
      res.redirect('/room/list');
    } else {
      req.session.errorDeletion = 'You are not Authorized to REMOVE this Room';
      res.redirect(`/room/show/${roomId}`);
    }
  } catch (err) {
    console.log('Soemthing went wrong during deletion of the room:', err);
  }
});

//GET to show a form for editing a room
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  const currentUserId = req.session.user?._id;
  Room.findById(id)
    .then((foundRoom) => {
      if (currentUserId === foundRoom.owner.toString()) {
        res.render('rooms/edit-room', { foundRoom });
      } else {
        req.session.error = 'You are not Authorized to edit this Room';
        res.redirect(`/room/show/${id}`);
      }
    })
    .catch((err) => {});
});

// POST to UPDATE THE ROOM
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl } = req.body;
  Room.findByIdAndUpdate(id, { name, description, imageUrl })
    .then(() => {
      res.redirect(`/room/show/${id}`);
    })
    .catch((err) => {});
});

//GET to show form for creating the Room
router.get('/create', isLoggedIn, (req, res) => {
  console.log('CREATING ROOM ');
  res.render('rooms/new-room');
});

// POST to create new ROOM
router.post('/create', isLoggedIn, (req, res) => {
  const user = req.session.user;
  const { name, description, imageUrl } = req.body;
  User.findOne({ _id: user._id })
    .then((foundUser) => {
      if (foundUser) {
        return Room.create({
          name,
          description,
          imageUrl,
          owner: foundUser._id,
        }).then(() => {
          res.redirect('/room/list');
        });
      } else {
        res.render('auth/login');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
