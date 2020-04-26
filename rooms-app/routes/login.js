const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const Room = require("../models/room-model");

// package for generating protected routes
// knows that passport is used for authentication and builds on that
const ensureLogin = require("connect-ensure-login");

router.get("/login", (request, response) => {
  console.log("logging in");
  response.render("login", { message: request.flash("error") });
});

// old: login check via session:
// router.post("/login", (request, response, next) => {
//   const { email, password } = request.body;

//   User.findOne({ email: email }).then((someUser) => {
//     if (someUser == null) {
//       response.render("login", { message: "Invalid credentials" });
//       return;
//     }
//     if (bcrypt.compareSync(password, someUser.password)) {
//       request.session.someUser = someUser;
//       response.redirect("/");
//     } else {
//       response.render("login", { message: "Invalid credentials" });
//     }
//   });
// });

// new: login check via passport:
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// old: logout via session:
// router.get("/logout", (request, response) => {
//   request.session.destroy((error) => {
//     if (error) {
//       console.log("Something went wrong at /Logout/: ", error);
//       next();
//     } else {
//       response.redirect("/");
//     }
//   });
// });

// new: logout via '.logout'
router.get("/logout", (request, response) => {
  request.logout();
  response.redirect("/");
});

// backup:
// router.get("/private", ensureLogin.ensureLoggedIn(), (request, response) => {
//   response.render("private");
// });

// re-written as asynchronous to test functionality
// 'console.log(roomsByUser)' would not work without async:
router.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    // start async-block: (see comments in findRoom() for non-async-version)
    const roomsByUser = await findRoom(request.user.id);
    console.log("Rooms for this user: ", roomsByUser);
    // end async-block

    // as soon as looged in 'user' views private section, all corresponding rooms get listed:
    response.render("private", { rooms: roomsByUser });
  }
);

function findRoom(userId) {
  try {
    return Room.find({ owner: userId }).exec();
  } catch (error) {
    return "Error in findRoom";
  }

  // start non-async-block:
  // Room.find({ owner: request.user.id })
  //   .then((found) => {
  //     //console.log(found);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     next();
  //   });
  // end non-async-block
}

module.exports = router;
