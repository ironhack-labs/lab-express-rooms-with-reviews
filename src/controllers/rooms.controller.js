const Room = require("./../models/Room")

exports.getRooms = async (req, res) => {
    
    try {
        const rooms = await Room.find({})
        console.log(rooms)
        res.render("rooms/index", {
            rooms
        })
    } catch (error) {
        console.log(error)
    }
}