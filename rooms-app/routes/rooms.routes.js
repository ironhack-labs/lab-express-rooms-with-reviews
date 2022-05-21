const router = require("express").Router();
const Room = require('../models/Room.model');
const User = require("../models/User.model");
const Review = require("../models/Reviews.model");

const isLoggedIn = require("../middlewares/isLoggedIn.js");
const isOwner = require('../middlewares/isOwner');



router.get('/create', isLoggedIn, async (req, res, next) => {
  try {
    const owner = await User.find();
  res.render('rooms/rooms-create', { owner });
  } catch(error) {
    next(error);
  }
});

router.post('/create', isLoggedIn, async (req, res, next) => {
  try {
    const { name, description, imageUrl } = req.body;
    const newRoom = await Room.create({
      name,
      description,
      imageUrl,
      owner: req.session.currentUser._id,
      reviews:[]
    });
    console.log(newRoom); 
  
    res.redirect('/create');
  } catch (error) {
    next(error);
  }
})

router.get('/:id/edit', isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render('rooms/rooms-edit', room);
    
  } catch (error) {
    next(error);
  }
})

router.post('/:id/edit', isOwner, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl} = req.body;
    await Room.findByIdAndUpdate(id,
      {
        name,
      description,
      imageUrl,
      
      },
      {
        new: true
      });
      
      res.redirect('/rooms');
  } catch (error) {
    next(error);
  }
})

router.post('/:id/delete', isOwner, async (req, res, next) => {
  try {
      const { id } = req.params;
      await Room.findByIdAndDelete(id);

      res.redirect('/rooms');
  }catch(error) {
      next(error);
  }
})

router.get("/rooms", async (req, res, next) => {
  try {
    const rooms = await Room.find()
    .populate('owner')
    .populate('reviews')
    res.render("rooms/rooms-list", { rooms });
  } catch(error) {
    next(error);
  }
});

module.exports = router;