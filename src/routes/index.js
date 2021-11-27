const router = require("express").Router()
const home = require ('./../controllers')

//routes
router.get('/', home)

//exports
module.exports = router