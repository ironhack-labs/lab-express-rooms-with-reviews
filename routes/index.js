const router = require('express').Router();
const { getHome, getPrivate } = require('../controllers/index');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth.middlewares');

router.get('/', isLoggedOut, getHome).get('/private', isLoggedIn, getPrivate);

module.exports = router;
