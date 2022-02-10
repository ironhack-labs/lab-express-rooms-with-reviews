const router = require("express").Router();
const Room = require("../models/Room.model");
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const isOwner = require("../middleware/isOwner");
const isNotOwner = require("../middleware/isNotOwner");

router.get("/", (req, res) => {
  Room.find()
    .populate("owner")
    .then((results) => {
      res.render("rooms/all-rooms.hbs", { results });
    });
});

router.get("/create", isLoggedIn, (req, res) => {
  res.render("rooms/create");
});

router.post("/create", isLoggedIn, (req, res) => {
  let { name, description } = req.body;
  Room.create({
    name,
    description,
    owner: req.session.user,
  }).then((results) => {
    res.redirect("/rooms");
  });
});

router.get("/:id/edit", isLoggedIn, isOwner, (req, res) => {
  Room.findById(req.params.id).then((results) => {
    res.render("rooms/edit", results);
  });
});

router.post("/:id/edit", isLoggedIn, isOwner, (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body).then((results) => {
    res.redirect("/rooms");
  });
});

router.post("/:id/delete", isLoggedIn, isOwner, (req, res) => {
  Room.findByIdAndDelete(req.params.id).then((results) => {
    res.redirect("/rooms");
  });
});

router.get("/permission-denied", (req, res) => {
  res.render("rooms/permission-denied");
});

router.get("/:id", (req, res) => {
  Room.findById(req.params.id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "user" } })
    .then((results) => {
      res.render("rooms/room", results);
    });
});

router.post("/:id/add-comment", isLoggedIn, isNotOwner, (req, res) => {
  Review.create({ user: req.session.user, comment: req.body.comment }).then(
    (results) => {
      Room.findByIdAndUpdate(req.params.id, {
        $push: { reviews: results._id },
      }).then((results) => {
        res.redirect("/rooms/" + req.params.id);
      });
    }
  );
});
module.exports = router;
