const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport')

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
]

// Register
router.get('/register', authController.register);
router.post('/register', authController.doRegister);

// Login
router.get('/login', authController.login);
router.post('/login', authController.doLogin);

// Login Google

router.get('/auth/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/authenticate/google/callback', authController.doLoginGoogle)


module.exports = router
