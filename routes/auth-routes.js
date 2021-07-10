//1 import packages and User model
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = process.env.SALT || 10;

const User = require('./../models/User.model');

const isNotLoggedIn = require('./../middleware/isNotLoggedIn')

//2 - Create 5 routes: 2 for login, 2 for signup and 1 for logout
router.get('/signup', isNotLoggedIn, (req, res) => {
	res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, (req, res) => {
	
	//GET VALUES FROM FORM
	const { username, email, password } = req.body;

	//VALIDATE INPUT
	if (
		!username ||
		username === '' ||
		!password ||
		password === '' ||
		!email ||
		email === '' ||
		!email.includes('@')
	) {
		res.render('auth/signup', { errorMessage: 'Something went wrong' });
	}

	//Check if user already exists
	User.findOne({ username: username })
		.then((user) => {
			
			//If user exists, send error
			if (user) {
				res.render('auth/signup', { errorMessage: 'This user already exists' });
				return;
			
			} else {
			
				//Hash the password
				const salt = bcrypt.genSaltSync(saltRounds);
				const hash = bcrypt.hashSync(password, salt);

				//If user does not exist, create it
				User.create({ username, email, password: hash })
					.then((newUser) => {

						console.log(newUser);
						//Once created, redirect
						res.redirect('/auth/login');
					})
					.catch((err) => console.log(err));
			}
		})
		.catch((err) => console.log(err));
});

router.get('/login', isNotLoggedIn, (req, res) => {
	res.render('auth/login');
});

router.post('/login', isNotLoggedIn, (req, res) => {
	//GET VALUES FROM FORM
	const { username, email, password } = req.body;

	//VALIDATE INPUT
	if (
		!username ||
		username === '' ||
		!password ||
		password === '' ||
		!email ||
		email === '' ||
		!email.includes('@')
	) {
		res.render('auth/signup', { errorMessage: 'Something went wrong' });
	}

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				res.render('auth/login', { errorMessage: 'Input invalid' });
			} else {
				
				const encryptedPassword = user.password;
				const passwordCorrect = bcrypt.compareSync(password, encryptedPassword);

				if (passwordCorrect) {
					req.session.currentUser = user;
					res.redirect('/private/profile');
				} else {
					res.render('auth/login', { errorMessage: 'Input invalid' });
				}
			}
		})
		.catch((err) => console.log(err));
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.render('error', { message: 'Something went wrong! Yikes!' });
		} else {
			res.redirect('/');
		}
	});
});

module.exports = router;
