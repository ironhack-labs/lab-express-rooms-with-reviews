const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const RoomModel = require("../models/Room.model");
const ReviewModel = require("../models/Review.model");


module.exports.profile = (req, res, next) => {
  console.log(req.user)
  res.render("private-area/profile.hbs");
};

module.exports.myRooms = (req, res, next) => {
  RoomModel.find({ owner: req.user.email }).then((rooms) => {
    res.render("private-area/my-rooms.hbs", { rooms });
  });
};

module.exports.editRoom = (req, res, next) => {
  RoomModel.findById(req.params.id)
    .then((room) => {
      res.render(`private-area/edit-room.hbs`, { room });
    })
    .catch((e) => console.error(e));
};

module.exports.doEditRoom = (req, res, next) => {
  RoomModel.findByIdAndUpdate(req.params.id, req.body)
    .then((room) => {
      res.redirect(`/private/my-rooms`);
    })
    .catch((e) => console.error(e));
};

module.exports.deleteRoom = (req, res, next) => {
  RoomModel.findByIdAndDelete(req.params.id)
    .then((room) => res.redirect("/private/my-rooms"))
    .catch((e) => console.error(e));
};
