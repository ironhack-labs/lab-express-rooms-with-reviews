const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Review = require("../models/Review");

router.get("/add", (req, res) => {
  res.render("rooms/add");
});

router.get("/", (req, res, next) => {
  const user = req.user;
  // show all rooms
  Room.find({})
    // populate to access the name from the user in the referenced Mongo DB table
    .populate("owner", "fullName")
    .then((rooms) => {
      res.render("rooms/index", { roomsList: rooms, user: user });
    })
    .catch((err) => {
      next(err);
    });
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

// Details Room

router.get("/:roomId/", (req, res, next) => {
  // show detail Room
  const roomQuery = { _id: req.params.roomId };
  Room.find(roomQuery)
    // populate to access the name from the user in the referenced Mongo DB table
    .populate("owner", "fullName")
    .then((room) => {
      res.render("rooms/roomDetails", { room });
    })
    .catch((err) => {
      next(err);
    });
});

// deletes the room
// an admin can delete any room - a user can only
// delete it when she is the owner

router.get("/delete/:roomId/", (req, res, next) => {
  const roomQueryDelete = { _id: req.params.roomId };

  if (req.isAuthenticated()) {
    Room.findOneAndDelete(roomQueryDelete)
      .then(() => {
        res.redirect("/rooms");
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.get("/edit/:roomId/", (req, res, next) => {
  const roomQueryEdit = { _id: req.params.roomId };

  if (req.isAuthenticated()) {
    Room.findOne(roomQueryEdit)
      .then((room) => {
        if (req.user.id == room.owner) {
          console.log("match!");

          res.render("rooms/edit", { room });
        } else {
          console.log("you are not allowed to edit this room");
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.post("/edit/:roomId/update", (req, res, next) => {
  const { name, description, imageUrl } = req.body;

  if (req.isAuthenticated()) {
    // console.log("UPDATED!");
    Room.update(
      { _id: req.params.roomId },
      {
        $set: {
          name: name,
          description: description,
          imageUrl: imageUrl,
        },
      },
      { new: true }
    )
      .then((room) => {
        res.redirect("/rooms");
      })
      .catch((err) => {
        next(err);
      });
  }
});

// Add review

router.get("/add-review/:roomId/", (req, res, next) => {
  const roomQueryEdit = { _id: req.params.roomId };

  if (req.isAuthenticated()) {
    Room.findOne(roomQueryEdit)
      .then((room) => {
        if (req.user.id != room.owner) {
          console.log("match!");

          res.render("rooms/addRev", { room });
        } else {
          console.log("you are not allowed to add reviews to this room");
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.post("/add-review/:roomId/", (req, res, next) => {
  const { review, user, comments } = req.body;

  if (req.isAuthenticated()) {
    // console.log("UPDATED!");
    Review.create({
      user: req.user.fullName,
      comment: comments,
    });

    console.log(res.data);
    Room.findByIdAndUpdate(
      req.params.roomId,
      {
        $push: { reviews: { user: user, comments: comments } },
      },
      { new: true }
    )

      .then((room) => {
        res.redirect("/rooms");
      })
      .catch((err) => {
        next(err);
      });
  }
});

module.exports = router;
