const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const auths = require("./auth.routes");
router.use("/auth", auths);

const rooms = require("./room.routes");
router.use("/rooms", rooms);

const reviews = require("./review.routes");
router.use("/reviews", reviews);

module.exports = router;
