const router = require ('express').Router()
const { getSignup, getLogin, postSignup, postLogin, postLogout } = require ("./../controllers/auth.controller")

const {isLoggedIn, isLoggedOut} = require('./../middlewares')
//routes

//signup
router.get('/signup', isLoggedOut, getSignup)
router.post('/signup', postSignup)

//login
router.get('/login', isLoggedOut, getLogin)
router.post('/login', postLogin)

//LOGOUT
router.post('/logout', isLoggedIn, postLogout)

//exports
module.exports = router