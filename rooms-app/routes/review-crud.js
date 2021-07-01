const express = require("express");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const Room = require("../models/room-model");
const Review = require("../models/review-model");

router.get(
  "/review-crud/add-review/:id",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    Room.findById({ _id: request.params.id })
      .then((room) => {
        console.log(request.user.id);
        console.log(room.owner);
        if (request.user.id != room.owner) {
          response.render("../views/review-crud/add-review", {
            roomId: request.params.id,
          });
        } else {
          console.log("You cannot review your own rooms.");
          response.redirect("/room-list");
        }
      })
      .catch((error) => {
        console.log("Error at /delete room/: ", error);
        next();
      });
  }
);

router.post(
  "/review-crud/add-review/:id",
  ensureLogin.ensureLoggedIn(),
  (request, response, next) => {
    Review.create({
      user: request.user.fullName,
      comment: request.body.review,
    })
      .then((review) => {
        // console.log(review);
        // console.log(review.user);
        // console.log(review.comment);
        // console.log("------");

        // const userRev = review.user;
        // const commentRev = review.comment;
        Room.updateOne(
          { _id: request.params.id },
          {
            $push: { reviews: review._id },
            //$push: { reviews: { user: userRev, comment: commentRev } },
          },
          { new: true }
        )
          .then((room) => {
            console.log("Added review!");
            response.redirect("/room-list");
          })
          .catch((error) => {
            console.log(error);
            next();
          });
      })
      .catch((error) => {
        console.log(error);
        next();
      });
  }
);

module.exports = router;
