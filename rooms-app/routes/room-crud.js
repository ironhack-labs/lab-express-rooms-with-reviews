const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Room = require("../models/room-model");
const User = require("../models/user-model");

router.get("/room-list", async (request, response) => {
  // '.populate' for resolving user model data in 'owner' field
  // ', "fullName"' to only retrieve fullName data from user model:
  const allRooms = await Room.find({}).populate("owner", "fullName");
  response.render("../views/room-crud/list-rooms", { allRooms });
});

router.get(
  "/room-crud/create-room",
  ensureLogin.ensureLoggedIn(),
  (request, response) => {
    //console.log(request.user);
    response.render("../views/room-crud/create-room", { user: request.user });
  }
);

router.post(
  "/room-crud/create-room",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    const { roomName, roomDescription, roomImage } = request.body;

    Room.findOne({ name: roomName }).then((existsAlready) => {
      if (existsAlready != null) {
        response.render("../views/room-crud/create-room", {
          message: "Room already exists",
        });
      } else {
        Room.create({
          name: roomName,
          description: roomDescription,
          imageUrl: roomImage,
          // assign ObjectID of logged in 'user' to the created room
          owner: request.user,
        })
          .then((room) => {
            console.log("Successfully created a new room: ", room);
            response.redirect("/private"); // , {room});
          })
          .catch((error) => {
            console.log("Something went wrong at /Create room/: ", error);
            next();
          });
      }
    });
  }
);

module.exports = router;
