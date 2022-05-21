const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

<<<<<<< HEAD
router.use('/rooms', require('./rooms.routes'));
router.use('/auth', require('./auth.routes'));  
=======
//router.use('/rooms', require('./rooms.routes'));
//router.use('/auth', require('./auth.routes')); 
>>>>>>> 57aa174112f55541e1b40c8800c15c51b84ceb6d

module.exports = router;
