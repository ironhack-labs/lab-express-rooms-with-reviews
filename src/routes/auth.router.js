// Importaciones.
const router = require("express").Router()

const { 
    getSignup, 
    postSignup,
    getLogin,
    postLogin, 
    postLogout
} = require("./../controllers/auth.controller")

const { isLoggedIn, isLoggedOut } = require("./../middlewares")

// Rutas.
// Sign up.
router.get("/signup", isLoggedOut, getSignup)
router.post("/signup", postSignup)

// Login
router.get("/login", isLoggedOut, getLogin)
router.post("/login", postLogin)

// Logout.
router.post("/logout", isLoggedIn, postLogout)

// Exportaciones.
module.exports = router