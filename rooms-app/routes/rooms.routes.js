const router = require ('express').Router();
const Room = require ('../models/Room.model');
 const { isLoggedIn } = require('../utils/consts'); 
/* const { route } = require('./index.routes'); */



// criar rooms/rooms-list
router.get('/', async (req, res, next) => {
    try {
      const rooms = await Room.find();
      res.render('rooms/rooms-list', { rooms, isLoggedIn: req.session.currentUser });
    } catch (error) {
      next(error);
    }
  })