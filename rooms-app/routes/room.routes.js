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
    .then((foundRoom) => {
      Review.findById();
      const review = foundRoom.reviews;
      res.render("room/create-review", { foundRoom, review });
    })
    .catch((err) => console.log(err));
});

router.post("/:id/review", (req, res, next) => {
  const id = req.session.currentUser;
  const _id = req.params;
  const { comment } = req.body;
  Review.create({ user: id, comment })
    .then((newReview) => {
      Room.updateOne({ id: _id }, { $push: { reviews: newReview } })
        .then(() => {})
        .catch((err) => console.log(err));
      res.redirect("/auth/profile");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
