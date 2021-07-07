//require authentification middleware
const isAuth = require("../../middlewares/auth.middleware")

// require user controller
const authController = require("../../controllers/auth.controller")


// routes/auth.routes.js

const { Router } = require('express');
const { use } = require('..');
const router = new Router();

// User model
const User = require('../../models/User.model');

router.get('/signup', authController.signUp);

router.post('/signup', authController.doSignUp);

router.get('/login', authController.login);

router.post('/login', authController.doLogin);

router.get('/logout', authController.logout);

router.get("/protectedroute", isAuth, (req, res, next) => {
  res.send("Your are authenticated, congrats!")
})

module.exports = router;
