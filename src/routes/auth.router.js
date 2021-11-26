// Importaciones.
const router = require("express").Router()

const { 
    getSignup, 
    postSignup,
    getLogin 
} = require("./../controllers/auth.controller")

// Rutas.
// Sign up.
router.get("/signup", getSignup)
router.post("/signup", postSignup)

// Login
router.get("/login", getLogin)

// Exportaciones.
module.exports = router