// Importaciones.
const router = require("express").Router()

const { 
    getSignup, 
    postSignup,
    getLogin,
    postLogin, 
    postLogout
} = require("./../controllers/auth.controller")

// Rutas.
// Sign up.
router.get("/signup", getSignup)
router.post("/signup", postSignup)

// Login
router.get("/login", getLogin)
router.post("/login", postLogin)

// Logout.
router.post("/logout", postLogout)

// Exportaciones.
module.exports = router