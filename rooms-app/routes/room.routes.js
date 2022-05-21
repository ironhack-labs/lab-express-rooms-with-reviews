const router = require("express").Router();
const Room = require("../models/Rooms.model");
const bcrypt = require("bcryptjs");
const { isLoggedIn } = require("../middlewares/auth.middleware");

router.get("/list", async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.render("rooms/list", { rooms, loggedInUser: req.session.currentUser });
  } catch (error) {
    next(error);
  }
});

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("rooms/create");
});

router.post("/create", async (req, res, next) => {
  const { name, description, imageUrl } = req.body;
  try {
    await Room.create({
      name,
      description,
      imageUrl,
    });
    res.redirect("/rooms");
  } catch (error) {
    next(error);
  }
});

router.get("/:id/update", async (req, res, next) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    res.render("rooms/update", { room });
  } catch (error) {
    error(next);
  }
});

router.post("/:id/update", async (req, res, next) => {
  const { id } = req.params;
  try {
    const { name, description, imageUrl } = req.body;
    await Room.findByIdAndUpdate(
      id,
      {
        name,
        description,
        imageUrl,
      },
      {
        new: true,
      }
    );
    res.redirect("/rooms");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render("rooms/room-details", room);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
