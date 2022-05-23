const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.use('/rooms', require('./rooms.routes'));
router.use('/auth', require('./auth.routes'));  
router.use("/", require ("./reviews.routes"));

module.exports = router;
