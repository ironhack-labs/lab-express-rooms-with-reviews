//1. IMPORT

const router            =require("express").Router()

const { getSignup, getLogin, postSignup, postLogin, postLogout }   =require("./../controllers/auth.controller") // como se llama index no tengo que poner el file
const  { isLoggedIn, isLoggedOut } = require("./../middlewares")

//2. Routes
//SIGNUP
router.get("/signup", isLoggedOut, getSignup)
router.post("/signup", isLoggedOut, postSignup)

//LOGIN
router.get("/login", isLoggedOut, getLogin)
router.post("/login", postLogin)

//LOGOUT
router.post("/logout",isLoggedIn, postLogout)


//3. EXPORT
module.exports = router