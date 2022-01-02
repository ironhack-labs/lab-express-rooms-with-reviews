const express = require('express');
const router = express.Router();

const Room = require('../models/Room.model');

// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary")

router.get('/rooms/create', (req, res) => {
	res.render('rooms/create-room');
});

router.post('/rooms/create', fileUploader.single('imageUrl'), (req, res) => {

	//Get the user id from the session
	const userId = req.session.currentUser._id;

	//Get the form data from the body
	const { name, description, imageUrl } = req.body;

	console.log(name, description, imageUrl);

	Room.create({
		name,
		description,
		imageUrl: req.file.path,
		owner: userId
	})
	.then((createdRoom) => {

		console.log(createdRoom)
		res.redirect('/private/rooms/create');

	})
	.catch((error) => {console.log(error)})

});

// router.get('/profile', (req, res) => {
// 	res.render('private/profile', { user: req.session.currentUser });
// });

module.exports = router;
