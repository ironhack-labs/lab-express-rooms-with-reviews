const passport = require("passport");
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const router = require("express").Router();

 
router.get('/auth/slack', passport.authenticate('slack'));

router.get('/auth/slack/callback',
  passport.authenticate('slack', {
    successRedirect: '/profile',
    failureRedirect: '/login' 
  })
);

router.get('/signup', (req, res, next) => {
	res.render('signup');
});

router.get('/login', (req, res, next) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	passReqToCallback: true
}));


router.post('/signup', (req, res, next) => {

	const { username, password } = req.body;
	// validation
	// is the password 5 + characters - 
	if (password.length < 5) {
		// if not we show the signup form again with a message 
		res.render('signup', { message: 'Your password has to be 8 chars min' });
		return;
	}
	// check if the username is empty
	if (username.length === 0) {
		// if yes show the form again with a message
		res.render('signup', { message: 'Your username cannot be empty' });
		return;
	}
	// validation passed - username and password are in the correct format
	// we now check if that username already exists
	User.findOne({ username: username })
		.then(userFromDB => {
			// if user exists
			if (userFromDB !== null) {
				// we render signup again	
				res.render('signup', { message: 'This username is already taken' });
				return;
			} else {
				// if we reach this point this username can be used 
				// we hash the password and create the user in the database
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt);
				
				User.create({ username: username, password: hash })
					.then(createdUser => {
						
						res.redirect('/login');
					})
					.catch(err => {
						next(err);
					})
			}
		})
});

router.get('/logout', (req, res, next) => {
	// destroy the session	
	req.logout();
	res.redirect('/');
});


module.exports = router;