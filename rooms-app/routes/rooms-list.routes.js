const router = require("express").Router();

const Room = require('../models/Room.model');

router.get('/rooms', (req, res) => {
	//Get rooms from DB
	Room.find()
		.populate('owner')
		.then((rooms) => {
			res.render('room/all-rooms', { rooms });
		})
		.catch((error) => {
			console.log(error);
		});
});

module.exports = router;