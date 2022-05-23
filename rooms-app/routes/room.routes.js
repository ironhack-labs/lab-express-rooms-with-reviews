const router = require("express").Router();
const Room = require("../models/Rooms.model");
/* const Review = require("../models/Review.model"); */
const bcrypt = require("bcryptjs");
const { isLoggedIn } = require("../middlewares/auth.middleware");

router.get("/list", async (req, res, next) => {
  try {
    const rooms = await Room.find().populate("reviews");
    res.render("rooms/list", { rooms, loggedInUser: req.session.currentUser });
  } catch (error) {
    next(error);
  }
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("rooms/create");
});

router.post("/create", async (req, res, next) => {
  // get user id from session
  /* const userId = req.session.currentUser._id; */

  const { name, description, imageUrl, owner, reviews } = req.body;
  try {
    await Room.create({
      name,
      description,
      imageUrl,
      owner: userId,
      reviews,
    });
    res.redirect("/rooms/list");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const rooms = await Room.findById(id);
    res.render("rooms/room-details", rooms);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render("rooms/edit", { room });
  } catch (error) {
    error(next);
  }
});

router.post("/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  const { name, description, imageUrl, reviews } = req.body;
  try {
    await Room.findByIdAndUpdate(
      id,
      {
        name,
        description,
        imageUrl,
        reviews,
      },
      {
        new: true,
      }
    );

    res.redirect("/rooms/list");
  } catch (error) {
    next(error);
  }
});

router.post("/:id/delete", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.redirect("/rooms/list");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
