
const router = require('express').Router();
const miscController = require('../controllers/misc.controller');
const authController = require('../controllers/auth.controller');

const multer = require('multer');
const upload = multer({ dest: './public/uploads' })

// Home
router.get('/', miscController.index);

// Signup
router.get('/register', authController.register);
router.post('/register', upload.single('image'), authController.doRegister);

// Login
router.get('/login', authController.login);
router.post('/login', authController.doLogin);

// Logout
// router.post('/logout', authController.logout);

module.exports = router;