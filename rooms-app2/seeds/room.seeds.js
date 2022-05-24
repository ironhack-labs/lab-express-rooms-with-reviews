require('../db');
const rooms = require('../data/rooms');
const Room = require('../models/Room.model');

const createRooms = async () => {
  try {
    await Room.create(rooms);
    console.log(`${rooms.length} rooms created`)
  } catch (error) {
    console.error(error);
  }
}

createRooms();

