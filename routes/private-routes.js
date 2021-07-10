const express = require('express');
const router = express.Router();

const Room = require('./../models/Room.model');

router.get('/profile', (req, res) => {
	res.render('private/profile', { user: req.session.currentUser });
});

router.get('/rooms/add', (req, res) => {
	res.render('rooms/new-room');
});

router.post('/rooms/add', (req, res) => {

	//Get the user id from the session
	const userId = req.session.currentUser._id;

	//Get the form data from the body
	const { name, description, imageUrl } = req.body;

	console.log(name, description, imageUrl);

	Room.create({
		name,
		description,
		imageUrl,
		owner: userId
	})
	.then((createdRoom) => {

		console.log(createdRoom)
		res.redirect('/private/rooms/add');

	})
	.catch((error) => {console.log(error)})

});

module.exports = router;
