const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

const Room = require("../models/Room.model");

// import library that allows us to upload files
const fileUploader = require("../config/cloudinary")

// require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

router.get("/userProfile/rooms/add", isLoggedIn, (req, res) => {
  res.render("room/new-room", { userInSession: req.session.currentUser });
});

//
router.post("userProfile/rooms/add", fileUploader.single('room-image'), (req, res) => {
  //Get the user id from the session
  const userId = req.session.currentUser._id;

  //Get the form data from the body
  const { name, description, imageUrl } = req.body;

  console.log(name, description, imageUrl);

  Room.create({
    name,
    description,
    imageUrl: req.file.path,
    owner: userId,
  })
    .then((createdRoom) => {
      console.log(createdRoom);
      res.redirect("/rooms");
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
