const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

const loginCheck = () => {
  return (req, res, next) => (req.session.user ? next() : res.redirect("/"));
};

router.get("/private", loginCheck(), (req, res) => {
  const loggedUser = req.session.user;
  res.render("private/private", { user: loggedUser });
});

module.exports = router;
