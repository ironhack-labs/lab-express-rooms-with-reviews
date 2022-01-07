const router = require('express').Router();
const { getHome, getPrivate } = require('../controllers')
const { isAnon, isLoggedIn } = require('../middlewares/auth.middlewares')

router.get('/', isAnon, getHome).get('/private', isLoggedIn, getPrivate)

module.exports = router;