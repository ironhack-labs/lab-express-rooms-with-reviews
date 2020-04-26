const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Room = require("../models/room-model");
const Review = require("../models/review-model");

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

router.get(
  "/room-crud/delete-room/:id",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    // console.log(request.user.id); // Object ID of logged-in user
    // console.log(request.params.id); // Object ID of room

    // read: "find the 'Room' where i just clicked 'Delete', then check
    // if the 'room.owner' equals the one who is logged in.
    // if 'true': delete this room and redirect to route '/room-list'"
    Room.findById({ _id: request.params.id })
      .then((room) => {
        // console.log(room);
        if (request.user.id == room.owner) {
          console.log("match!");
          Room.findByIdAndDelete({ _id: request.params.id })
            .then((success) => {
              console.log("success deleting");
              response.redirect("/room-list");
            })
            .catch((error) => {
              console.log(error);
              next();
            });
        } else {
          response.render("../views/room-crud/list-rooms", {
            message: "You are not allowed to do that.",
          });
        }
      })
      .catch((error) => {
        console.log("Error at /delete room/: ", error);
        next();
      });
  }
);

router.get(
  "/room-crud/edit-room/:id",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    Room.findById({ _id: request.params.id })
      .then((room) => {
        // console.log(room);
        if (request.user.id == room.owner) {
          console.log("match!");
          response.render("../views/room-crud/edit-room", {
            roomId: request.params.id,
          });
        } else {
          response.render("../views/room-crud/list-rooms", {
            message: "You are not allowed to do that.",
          });
        }
      })
      .catch((error) => {
        console.log("Error at /editing room/: ", error);
        next();
      });
  }
);

// same logic as for 'delete room'
router.post(
  "/room-crud/edit-room/:id",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    Room.findById({ _id: request.params.id })
      .then((room) => {
        // console.log(room);
        if (request.user.id == room.owner) {
          console.log("match!");

          const { roomName, roomDescription, roomImage } = request.body;
          // assign values of input fields to the Room properties
          // '{new: true}' to return updated object
          Room.update(
            { _id: request.params.id },
            {
              $set: {
                name: roomName,
                description: roomDescription,
                imageUrl: roomImage,
              },
            },
            { new: true }
          )
            .then((room) => {
              response.redirect("/room-list");
            })
            .catch((error) => {
              console.log(error);
              next();
            });
        } else {
          response.render("../views/room-crud/list-rooms", {
            message: "You are not allowed to do that.",
          });
        }
      })
      .catch((error) => {
        console.log("Error at /editing room/: ", error);
        next();
      });
  }
);

router.get("/room-crud/show-reviews/:id", async (request, response) => {
  // to be continued:
  response.render("../views/room-crud/show-reviews");
});

module.exports = router;
