const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Room = require("../models/room-model");

router.get(
  "/room-crud/create-room",
  ensureLogin.ensureLoggedIn(),
  (request, response) => {
    //console.log("got it");
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
          image: roomImage,
          owner: request.user,
        })
          .then((room) => {
            console.log("Successfully created a new room!");
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
