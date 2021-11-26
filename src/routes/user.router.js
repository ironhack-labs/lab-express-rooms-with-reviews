// Importaciones
const router = require("express").Router()

const { getProfile } = require("./../controllers/user.controller")

const { isLoggedIn } = require("./../middlewares")

// Rutas
router.get("/:user", isLoggedIn, getProfile)

// Exportación
module.exports = router