const router = require("express").Router();
const Room = require('../models/Room.model');

router.get("/rooms", (req, res, next) => {
  res.render("rooms/rooms-list");
});
router.get('/create', (req, res, next) => {
  res.render('rooms/rooms-create');
})

router.post('/create', async (req, res, next) => {
  try {
    const { name, description, imageUrl, owner, reviews } = req.body;
    await Room.create({
      name,
      description,
      imageUrl,
      owner,
      reviews
    });

    res.redirect('/rooms');
  } catch (error) {
    next(error);
  }
})

router.get('/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);
    res.render('rooms/rooms-edit', room);
  } catch (error) {
    next(error);
  }
})

router.post('/:id/edit', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, owner, reviews } = req.body;
    await Room.findByIdAndUpdate(id,
      {
        name,
      description,
      imageUrl,
      owner,
      reviews
      },
      {
        new: true
      });
    
      res.redirect(`/rooms/${id}`);
  } catch (error) {
    next(error);
  }
})

module.exports = router;