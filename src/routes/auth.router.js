const router = require ('express').Router()
const { getSignup, getLogin } = require ("./../controllers/auth.controller")

//routes

//signup
router.get('/signup', getSignup)

//login
router.get('/login', getLogin)

//exports
module.exports = router