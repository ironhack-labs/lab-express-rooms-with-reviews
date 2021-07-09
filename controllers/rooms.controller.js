const mongoose = require("mongoose");
const RoomModel = require("../models/Room.model");

module.exports.listRooms = (req, res, next) => {
  RoomModel.find({})
    .populate("owner", "fullName")
    .then((rooms) => {
      res.render("rooms/list.hbs", { rooms });
    });
};

module.exports.create = (req, res, next) => {
  res.render("rooms/create.hbs", { user: req.user });
};

module.exports.doCreate = (req, res, next) => {
  RoomModel.findOne({ name: name }).then((existsAlready) => {
    if (existsAlready != null) {
      res.render("rooms/list.hbs", { room });
    } else {
      RoomModel.create({
        name: name,
        description: description,
        imageUrl: image,
        owner: req.user,
      })
      .then((room) => {
        console.log("Successfully created a new room: ", room);
        res.redirect("/"); // , {room});
      })
      .catch((error) => {
        console.log("Something went wrong at", error);
        next();
      });
    }
  });
};
