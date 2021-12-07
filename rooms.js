const express = require('express')
const router = express.Router()

const User = require("../models/User.model")
const Room = require("../models/Room.model")

router.get('/', async (req, res) => {
    let listRooms = []
    let error = null
    
    try {
        listRooms = await Room.find().populate('owner')
    } catch (e) {
        error = { errType: "DB_ERR", message: e }
    } finally {
        res.render('rooms/rooms-list', { rooms: listRooms, error })
    }
})

router.route('/new')
    .get( async (req, res) => {
        const users = await User.find()
        res.render('rooms/new-room', { users })
    })
    .post( async (req, res) => {
        const {name, description, owner} = req.body
        console.log("req.body", req.body)
        try {

            if (!name || !description || !owner) {
                res.render('rooms/new-room', { error: {type: "ROOM_ERROR", message: "Error in Room creation!" }})
            }
            const newRoom = await Room.create({name, description, owner})
        } catch (e) {
            error = { errType: "DB_ERR", message: e }
        } finally {
            res.redirect('/rooms')
        }
    })

module.exports = router