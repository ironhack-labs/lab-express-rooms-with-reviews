const router = require("express").Router();
const Review = require("../models/Review.model");
const Room = require("../models/Rooms.model");
/* const { isLoggedIn } = require("../middlewares/auth.middleware"); */

/* router.get("/", (req, res, next) => {
  res.render("reviews");
}); */

router.get("/:id/create-review", (req, res, next) => {
  const { id } = req.params;
  res.render("reviews/create-review", { id });
});

router.post("/:id/create-review", async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    const newReview = await Review.create({
      user: req.session.currentUser_id,
      comment,
    });
    await Room.findByIdAndUpdate(
      id,
      {
        $addToSet: { reviews: newReview._id },
      },
      { new: true }
    );
    res.redirect(`/rooms/${id}`);
  } catch (error) {
    next(error);
  }
});

/* router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const oneReview = Review.findById(id);
    res.render("rooms/rooms-list", oneReview);
  } catch (error) {
    next(error);
  }
}); */

module.exports = router;
