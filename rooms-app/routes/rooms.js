const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.get("/add", (req, res) => {
  res.render("rooms/add");
});

router.get("/", (req, res, next) => {
  // show all rooms
  Room.find()
    .then((rooms) => {
      res.render("rooms/index", { roomsList: rooms });
    })
    .catch((err) => {
      next(err);
    });
  // just show the rooms of the logged in user
  /*
  Room.find({ owner: req.user._id })
    .then(rooms => {
      res.render('rooms/index', { roomsList: rooms });
    })
    .catch(err => {
      next(err);
    });
    */
});

router.post("/", (req, res, next) => {
  const { name, description, imageUrl } = req.body;
  if (!req.isAuthenticated()) {
    res.redirect("/");
    return;
  }

  Room.create({
    name: name,
    description: description,
    imageUrl: imageUrl,
    owner: req.user._id,
  })
    .then((room) => {
      console.log(room);
      res.redirect("/rooms");
    })
    .catch((err) => {
      next(err);
    });
});

// deletes the room
// an admin can delete any room - a user can only
// delete it when she is the owner
router.get("/:roomId/", (req, res, next) => {
  const query = { _id: req.params.roomId };

  if (req.user.role !== "admin") {
    query.owner = req.user._id;
  }

  // that is the long version of what is happening
  // if user.role !== 'admin'
  // query: { _id: req.params.roomId, owner: req.user._id }
  // else if user.role === 'admin'
  // query; { _id: req.params.roomId }

  Room.findOneAndDelete(query)
    .then(() => {
      res.redirect("/rooms");
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
