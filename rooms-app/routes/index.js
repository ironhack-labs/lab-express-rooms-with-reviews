const express = require('express');
const router  = express.Router();
const Room = require('../models/room')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//Show all rooms
router.get('/rooms', (req, res, next) => {
  Room.find()
  .then(rooms => {
    res.render("showRoom", {rooms: rooms})
  })
  .catch(error => {
    console.log(error);
  })
});

module.exports = router;
