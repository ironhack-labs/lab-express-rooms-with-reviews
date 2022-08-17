const { Router } = require("express");
const router = new Router();

const mongoose = require("mongoose");

const Room = require("../models/Room.model");

// import library that allows us to upload files
const fileUploader = require("../config/cloudinary");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

router.get("/userProfile/rooms/add", isLoggedIn, (req, res) => {
  res.render("room/new-room", { userInSession: req.session.currentUser });
});

router.post("/userProfile/rooms/add", fileUploader.single('room-image'), (req, res) => {

  //Get the form data from the body
  const { name, description, imageUrl, owner } = req.body;

   // 'owner' represents the ID of the user document
  console.log(name, description, imageUrl, owner);
 

  Room.create({
    name,
    description,
    imageUrl: req.file.path,
    owner
  })
    .then((createdRoomFromDB) => {
        // when the new room is created, the user needs to be found and its owner updated with the
      // ID of newly created room
      return Room.findByIdAndUpdate(owner, { $push: { owner: createdRoomFromDB._id }})
      console.log(createdRoomFromDB);     
    })
    .then(() => res.redirect("/rooms")) // if everything is fine, redirect to list of rooms
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
