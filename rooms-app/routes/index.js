const router = require("express").Router();

const Room = require('./../models/Room.model');
const Review = require('./../models/Review.model');

// ----------------------------------------------------------------------
// FOLLOW INVERTED PYRAMID RULE FOR ROUTING: FROM MOST TO LEAST SPECIFIC
// ----------------------------------------------------------------------

router.get('/rooms/:id', (req, res) => {
	const { id } = req.params;
	//const roomId = req.params.id

  

	Room.findById(req.params.id)
		.populate('owner')	// owner is property key of the room object, it has an id inside. populates takes the id and extracts de data (populates) from this id
		.populate({				// 2nd level populate
			path: 'reviews',
			populate: {
				path: 'user'
			}
		})
		.then((room) => {
			console.log(room)
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
				$addToSet: { reviews: newReview._id }	// $addToSet for arrays and ensure no objects are duplicates
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

/* GET home page */
router.get('/', (req, res, next) => {
	// to make login button dissapear from navbar, the user object should be passed when rendering
	res.render('index');
});

module.exports = router;

