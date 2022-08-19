const router = require("express").Router();
const Room = require("../models/Room.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

// CREATE ***********************************************
router.get("/create", (req, res, next) => {
  res.render("room/create-room");
});

router.post("/create", (req, res, next) => {
  const { name, description, image } = req.body;
  const { _id } = req.session.currentUser;
  Room.create({ name, description, image, owner: _id })
    .then((createdRoom) => {
      res.redirect("/auth/profile");
    })
    .catch((error) => console.log(error));
});

// EDIT ***********************************************
router.get("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  Room.findById(id)
    .then((foundRoom) => {
      res.render("room/edit-room", { foundRoom });
    })
    .catch((err) => console.log(err));
});

router.post("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  Room.findByIdAndUpdate(id, { name, description, image })
    .then(() => {
      res.redirect("/auth/profile");
    })
    .catch((err) => console.log(err));
});

// DELETE ***********************************************
router.get("/:id/delete", (req, res, next) => {
  const { id } = req.params;
  Room.deleteOne({ id })
    .then(() => {
      res.redirect("/auth/profile");
    })
    .catch((err) => console.log(err));
});

// REVIEW ***********************************************

router.get("/:id/review", (req, res, next) => {
  const { id } = req.params;

  Room.findById(id)
    .populate("reviews")
    .then((foundRoom) => {
      let arr = foundRoom.reviews;
      res.render("room/create-review", { arr, foundRoom });
    })
    .catch((err) => console.log(err));
});

router.post("/:id/review", (req, res, next) => {
  const idUser = req.session.currentUser;
  const { id } = req.params;
  const { comment } = req.body;
  Review.create({ user: idUser, comment })
    .then((newReview) => {
      Room.findByIdAndUpdate(id, { $push: { reviews: newReview } })
        .then((da) => {
          res.redirect("/auth/profile");
          console.log(da);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

module.exports = router;
