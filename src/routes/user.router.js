//imports
const router = require('express').Router()
const {getProfile} = require('./../controllers/user.controller')

const {isLoggedIn} = require ('./../middlewares')


//Routes
router.get('/:user',isLoggedIn ,getProfile)

//Export
module.exports = router