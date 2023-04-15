const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.render('rooms/index', { rooms });
  } catch (error) {
    console.log(error);
  }
});

// Show the form for creating a new room
router.get('/new', (req, res) => {
  res.render('rooms/new');
});

// Create a new room
router.post('/', async (req, res) => {
  const { name, description, imageUrl } = req.body;
  try {
    const room = new Room({ name, description, imageUrl, owner: req.user._id });
    await room.save();
    res.redirect('/rooms');
  } catch (error) {
    console.log(error);
  }
});

// Show a specific room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('owner');
    res.render('rooms/show', { room });
  } catch (error) {
    console.log(error);
  }
});

// Show the form for editing a room
router.get('/:id/edit', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    res.render('rooms/edit', { room });
  } catch (error) {
    console.log(error);
  }
});

// Update a room
router.put('/:id', async (req, res) => {
  const { name, description, imageUrl } = req.body;
  try {
    await Room.findByIdAndUpdate(req.params.id, { name, description, imageUrl });
    res.redirect(`/rooms/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});

// Delete a room
router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.redirect('/rooms');
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
