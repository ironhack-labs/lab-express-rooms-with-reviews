const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const auths = require("./auth.routes");
router.use("/auth", auths);

console.log("before rooms");
const rooms = require("./room.routes");
router.use("/rooms", rooms);
console.log("after rooms");
const reviews = require("./review.routes");
router.use("/rooms", reviews);

module.exports = router;
