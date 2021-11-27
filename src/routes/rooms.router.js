const router = require('express').Router()

const { getRooms} = require('./../controllers/rooms.controller')

router.get('/', getRooms)

module.exports = router