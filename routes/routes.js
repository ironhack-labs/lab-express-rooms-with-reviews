const router = require('express').Router();
const roomsRouter = require('./rooms.routes');
const reviewsRouter = require('./reviews.routes');
const usersRouter = require('./users.routes')


// Home Page
router.get('/', (req, res, next) => {
  res.render('home')
});

// router.use('/rooms', roomsRouter);

// router.use('/reviews', reviewsRouter);

router.use('/users', usersRouter);

module.exports = router