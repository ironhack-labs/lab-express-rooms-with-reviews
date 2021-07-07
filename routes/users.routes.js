const router = require('express').Router();
const authController = require('../controllers/auth.controller');

// Register

router.get('/register', authController.register);
router.post('/register', authController.doRegister);

module.exports = router
