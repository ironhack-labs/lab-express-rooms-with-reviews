const router = require("express").Router();
const Room = require('../models/Room.model');

router.get("/rooms", (req, res, next) => {
  res.render("rooms/rooms-list");
});

module.exports = router;