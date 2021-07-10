const router = require('express').Router();

const Room = require('./../models/Room.model');
const Review = require('./../models/Review.model');

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

router.get('/rooms', (req, res) => {
	//Get rooms from DB
	Room.find()
		.populate('owner')
		.then((rooms) => {
			res.render('rooms/all-rooms', { rooms });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get('/rooms/:id', (req, res) => {
	const { id } = req.params;
	//const roomId = req.params.id

  

	Room.findById(req.params.id)
		.populate('owner')
		.populate({
			path: 'reviews',
			populate: {
				path: 'user'
			}
		})
		.then((room) => {
			res.render('rooms/one-room', { room });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.post('/rooms/:id', (req, res) => {
	//GET the values
	const roomId = req.params.id;
	const { comment } = req.body;

	Review.create({
		user: req.session.currentUser._id,
		comment // comment: req.body.comment
	})
		.then((newReview) => {
			console.log(newReview);

			Room.findByIdAndUpdate(roomId, {
				$addToSet: { reviews: newReview._id }
			})
				.then((updatedRoom) => {
					console.log(updatedRoom);
					res.redirect(`/rooms/${roomId}`);
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;
