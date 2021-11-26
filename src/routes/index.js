// 1. Importaciones
const router = require("express").Router()
const home = require("./../controllers")

// Rutas
router.get("/", home)

// Exportación
module.exports = router
