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
  res.render("movies/new-room");
};

module.exports.doCreateRoom = (req, res, next) => {
  Room.create(req.body)
    .then((room) => {
      res.redirect("/rooms");
    })
    .catch((e) => res.render("rooms/new-room"));
};

module.exports.idRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    .populate("cast")
    .then((room) => {
      res.render("rooms/room-details", { room });
    })
    .catch(next);
};

module.exports.editRoom = (req, res, next) => {
  Room.findById(req.params.id)
    .then((room) => {
      res.render(`rooms/edit-room`, { room });
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
  Room.findByIdAndDelete(id)
    .then((room) => res.redirect(`/rooms`))
    .catch(next);
};
