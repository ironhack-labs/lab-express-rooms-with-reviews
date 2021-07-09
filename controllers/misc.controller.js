const router = require("express").Router();
const passport = require("passport");

const Room = require("../models/Room.model");
const Review = require("../models/Review.model");

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
    .populate("reviews")
    .then((room) => {
      console.log("hola")
      let userRoom = false;
      if (room.owner == req.user.email) {
        userRoom = true
      }
      res.render("rooms/room-details", { room: room, userRoom });
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

module.exports.doCreateReview = (req, res, next) => {
  const data = {
    comment: req.body.comment,
    user: req.user.email,
    roomId: req.params.roomid,
  };
  Review.create(data)
    .then(() => {
      res.redirect(`/rooms/${data.roomId}`);
    })
    .catch(next);
};

module.exports.deleteReview = (req, res, next) => {
  const { id } = req.params;
  Review.findById(id)
    .then((review) => {
      const roomid = review.roomId;
      if (review.user == req.user.email) {
        Review.findByIdAndDelete(id)
          .then((review) => {
            res.redirect(`/rooms/${roomid}`);
          })
          .catch(next);
      } else {
        res.redirect(`/rooms/${review.roomId}`);
      }
    })
    .catch(next);
};
