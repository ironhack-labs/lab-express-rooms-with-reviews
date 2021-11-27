//1. IMPORTACION
const express		= require("express")
const router		= express.Router()

const { getProfile }	= require("../controllers/user.Controller.js")
const { isLoggedIn, isLoggedOut } = require("./../middlewares")

//2. RUTEO
router.get("/:user", isLoggedIn, getProfile)



module.exports = router