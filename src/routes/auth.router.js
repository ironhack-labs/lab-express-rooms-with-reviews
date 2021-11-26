// Importaciones.
const router = require("express").Router()

const { 
    getSignup, 
    getLogin 
} = require("./../controllers/auth.controller")

// Rutas.
// Sign up.
router.get("/signup", getSignup)

// Login
router.get("/login", getLogin)

// Exportaciones.
module.exports = router