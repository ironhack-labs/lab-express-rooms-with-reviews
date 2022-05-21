const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authApp = require("./auth.routes");
router.use("/auth", authApp);

const roomApp = require("./room.routes");
router.use("/rooms", roomApp);

module.exports = router;
