const router = require ('express').Router();
const Room = require ('../models/Room.model');
/* const { isLoggedIn } = require('../middleware/auth.middlewares'); */

// link to rooms-list

 router.get('/', async (req, res, next) => {
    try {
      const rooms = await Room.find();
      res.render('rooms/rooms-list', { rooms, isLoggedIn: req.session.currentUser });
    } catch (error) {
      next(error);
    }
  })  

  // Criar / editar / deletar

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
        reviews: []
      });
  
      res.redirect('rooms');
    } catch (error) {
      next(error);
    }
  })

  module.exports = router;  