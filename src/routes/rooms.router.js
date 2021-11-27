// Importaciones.
const router = require("express").Router()
const { getRooms } = require("./../controllers/rooms.controller")
const { isLoggedIn } = require("./../middlewares/index")

// Rutas
router.get("/", getRooms)

// Exportación
module.exports = router