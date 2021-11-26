//1. IMPORT

const router            =require("express").Router()

const { getSignup, getLogin }   =require("./../controllers/auth.controller") // como se llama index no tengo que poner el file

//2. Routes
//SIGNUP
router.get("/signup", getSignup)

//LOGIN
router.get("/login", getLogin)


//3. EXPORT
module.exports = router