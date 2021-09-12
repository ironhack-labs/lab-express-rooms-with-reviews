const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// middleware to protect a route

const loginCheck = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      // proceed as planned
      next();
    } else {
      res.redirect('/profile');
    }
  }
}

router.get('/profile', loginCheck(), (req, res, next) => {
  console.log('LOGGED IN')
  const loggedInUser = req.user;
  res.render('/views/profile', { user: loggedInUser })
});

module.exports = router;
