//1. IMPORT

const router            =require("express").Router()

const { getRooms }   =require("./../controllers/rooms.controller") 
const { isLoggedIn } =require("./../middlewares")

//2. Routes
router.get("/",isLoggedIn, getRooms)


//3. EXPORT
module.exports = router