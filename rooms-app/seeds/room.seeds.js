const Room = require("../models/Rooms.model");
const rooms = require("../data/data");
require("../db");

const createRooms = async () => {
  try {
    await Room.create(rooms);
  } catch (error) {
    console.log(error);
  }
};

createRooms();
