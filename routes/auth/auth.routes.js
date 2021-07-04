// require user controller
const authController = require("../../controllers/auth.controller")


// routes/auth.routes.js

const { Router } = require('express');
const { use } = require('..');
const router = new Router();

// User model
const User = require('../../models/User.model');

router.get('/', authController.signUp);

router.post('/', authController.doSignUp);

module.exports = router;
