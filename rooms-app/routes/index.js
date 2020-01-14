const express = require('express');
const router  = express.Router();
const loginCheck = require("../routes/loginCheck");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


router.get("/private", loginCheck, (req, res) => {
  const loggedUser = req.session.user;

  res.render("private/private");
});

module.exports = router;
