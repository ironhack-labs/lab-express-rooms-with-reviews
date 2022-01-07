const Room = require('../models/room.model')

async function getPrivate(req, res) {
    const user = req.session.currentUser
    
    const rooms = await Room.find({owner: user._id}).populate('imageUrl')
    res.render('auth-views/home', {user, rooms})
}

async function getHome(req, res){
    const rooms = await Room.find().populate('imageUrl').populate('owner')

    res.render('index', {rooms})
}


module.exports = { getHome, getPrivate }