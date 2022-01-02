const router = require('express').Router();
const {
  getLogin,
  getSignup,
  signup,
  login,
  logout,
} = require('../controllers/auth.controllers');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth.middlewares');

router
  .get('/signup', isLoggedOut, getSignup)
  .get('/login', isLoggedOut, getLogin)
  .post('/signup', isLoggedOut, signup)
  .post('/login', isLoggedOut, login)
  .post('/logout', isLoggedIn, logout);

module.exports = router;
