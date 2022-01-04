const router = require('express').Router();
const { getHome } = require('../controllers')

router.get('/', getHome)

module.exports = router;