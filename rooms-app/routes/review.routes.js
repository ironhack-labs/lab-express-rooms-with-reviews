const router = require("express").Router();
const Review = require("../models/Review.model");
/* const { isLoggedIn } = require("../middlewares/auth.middleware"); */

router.get("/", (req, res, next) => {
  res.render("reviews");
});

router.get("/create-review", (req, res, next) => {
  res.render("reviews/create-review");
});

router.post("/create-review", async (req, res, next) => {
  const { user, comment } = req.body;
  try {
    const newReview = Review.create({
      user,
      comment,
    });
    res.redirect("/rooms/list");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const oneReview = Review.findById(id);
    res.render("rooms/rooms-list", oneReview);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
