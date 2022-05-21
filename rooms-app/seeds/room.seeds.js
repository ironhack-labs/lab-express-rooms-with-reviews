require("../db")
const rooms = require("../data/data")
const Room = require("../models/Rooms.model")

const createRooms = async = () => {
  try{
    await Room.create(rooms)
    console.log(`you created ${rooms.length} rooms`)
  } catch(error){
    console.log(error)
  }
}

createRooms()