
const router = require('express').Router();
const miscController = require('../controllers/misc.controller');
// const authController = require('../controllers/auth.controller');

// Home
router.get('/', miscController.index);

// Signup


module.exports = router;