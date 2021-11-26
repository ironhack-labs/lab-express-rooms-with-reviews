//1. IMPORT

const router            =require("express").Router()

const home   =require("./../controllers") // como se llama index no tengo que poner el file

//2. Routes
router.get("/", home)




//3. EXPORT
module.exports = router