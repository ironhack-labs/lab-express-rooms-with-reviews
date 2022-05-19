const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const roomsApp = require("./auth.routes");
router.use("/auth", roomsApp);

module.exports = router;
