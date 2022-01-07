const Room = require("../models/room.model");
const Picture = require("../models/picture.model");
const { findByIdAndDelete } = require("../models/room.model");

function getRoom(req, res) {
  try {
    res.render("room-views/createRoom");
  } catch (error) {
    console.error(error);
  }
}

async function room(req, res) {
  try {
    const { name, description } = req.body;
    const userID = req.session.currentUser._id;

    const picture = new Picture({
      path: `/uploads/${req.file.filename}`,
    });
    await Room.create({
      name,
      description,
      imageUrl: picture._id,
      owner: userID,
    });

    picture.save().then(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    console.error(`Error creating room ${error}`);
  }
}

function getEditRoom(req, res) {
  const roomID = req.params.id;
  res.render("room-views/editRoom", { roomID });
}

async function editRoom(req, res) {
  try {
    const { name, description } = req.body;
    const userID = req.session.currentUser._id;
    const roomID = req.params.id;
    const picture = new Picture({
      path: `/uploads/${req.file.filename}`,
    });
    await Room.findByIdAndUpdate(roomID, {
      name,
      description,
      imageUrl: picture._id,
      owner: userID,
    });

    picture.save().then(() => {
      res.redirect(`/`);
    });
  } catch (error) {
    console.error(`error editing room ${error}`);
  }
}

function getDeleteRoom(req, res) {
  roomID = req.params.id;
  res.render("room-views/deleteRoom", { roomID });
}

async function deleteRoom(req, res) {
  try {
    roomID = req.params.id;
    await Room.findByIdAndDelete(roomID);
    res.redirect("/");
  } catch (error) {
    console.error(`error deleting room ${error}`);
  }
}

module.exports = {
  getRoom,
  room,
  getEditRoom,
  editRoom,
  getDeleteRoom,
  deleteRoom,
};
