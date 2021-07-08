const router = require("express").Router();
const passport = require("passport");

const Room = require("../models/Room.model");

module.exports.index = (req, res, next) => {
  res.render("index");
};

module.exports.profile = (req, res, next) => {
  res.render("profile");
};

module.exports.rooms = (req, res, next) => {
  Room.find()
    .then((rooms) => {
      res.render("rooms/rooms", { rooms: rooms });
    })
    .catch(next);
};

module.exports.createRoom = (req, res, next) => {
  res.render("rooms/new-room");
};

module.exports.doCreateRoom = (req, res, next) => {
  const data = {
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    owner: req.user.email,
  };
  Room.create(data)
    .then((room) => {
      console.log(room);
      res.redirect("/rooms");
    })
    .catch((e) => res.render("rooms/new-room"));
};

module.exports.idRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    //.populate("cast")
    .then((room) => {
      console.log(room);
      res.render("rooms/room-details", { room: room });
    })
    .catch(next);
};

module.exports.editRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    .then((room) => {
      if (room.owner == req.user.email) {
        res.render(`rooms/edit-room`, { room: room });
      } else {
        res.redirect(`/rooms/${id}`);
      }
    })
    .catch(next);
};

module.exports.doEditRoom = (req, res, next) => {
  Room.findByIdAndUpdate(req.params.id, req.body)
    .then((room) => {
      res.redirect(`/rooms`);
    })
    .catch(next);
};

module.exports.deleteRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    .then((room) => {
      if (room.owner == req.user.email) {
        Room.findByIdAndDelete(id)
          .then((room) => {
            res.redirect(`/rooms`);
          })
          .catch(next);
      } else {
        res.redirect(`/rooms/${id}`);
      }
    })
    .catch(next);
};
