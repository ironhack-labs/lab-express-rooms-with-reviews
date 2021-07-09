const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const RoomModel = require("../models/Room.model");
const ReviewModel = require("../models/Review.model");

module.exports.list = (req, res, next) => {
  const name = req.query.name || ''
  RoomModel.find({
    name: { "$regex": name, "$options": "i" } 
  })
  .then((rooms) => {
    res.render("rooms/list.hbs", { rooms } );
  })
  .catch((e) => console.error(e));
};

module.exports.create = (req, res, next) => {
  res.render("rooms/create.hbs");
};

module.exports.detail = (req, res, next) => {
  RoomModel.findById(req.params.id)
  .then((room) => {
    res.render("rooms/detail.hbs", { room });
  })
  .catch((e) => console.error(e));
};

module.exports.doCreate = (req, res, next) => {
  const data = {
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    owner: req.user.email,
  };
  RoomModel.create(data)
    .then((room) => {
      console.log(room);
      res.redirect("/private/my-rooms");
    })
    .catch((e) => res.render("rooms/create.hbs"));
};


// module.exports.doEdit = (req, res, next) => {
//   RoomModel.findByIdAndUpdate(req.params.id, req.body)
//     .then((room) => res.redirect("/rooms/new.hbs"))
//     .catch((e) => console.error(e));
// };


// module.exports.ReviewdoCreate = (req, res, next) => {
//   const data = {
//     comment: req.body.comment,
//     user: req.user.email,
//     roomId: req.params.roomid,
//   };
//   Review.create(data)
//     .then(() => {
//       res.redirect(`/rooms/${data.roomId}`);
//     })
//     .catch(next);
// };

// module.exports.Reviewdelete = (req, res, next) => {
//   const { id } = req.params;
//   Review.findById(id)
//     .then((review) => {
//       const roomid = review.roomId;
//       if (review.user == req.user.email) {
//         Review.findByIdAndDelete(id)
//           .then((review) => {
//             res.redirect(`/rooms/${roomid}`);
//           })
//           .catch(next);
//       } else {
//         res.redirect(`/rooms/${review.roomId}`);
//       }
//     })
//     .catch(next);
// };
