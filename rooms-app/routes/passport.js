const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 10;
const bcrypt = require('bcrypt');


router.get('/signup', (req, res, next) => {
	res.render('signup');
});

router.post('/signup', (req, res, next) => {
	const { email, password, fullName } = req.body
	if (!email || !password || !fullName) {
		res.render('signup', {
			errorMessage: 'Please fill the form with your personal information'
		});
	}

	User.findOne({ email })
		.then((user) => {

			if (user) {
				res.render('signup', { errorMessage: 'User already exists' });
			}

			const salt = bcrypt.genSaltSync(saltRound);
			const hashPassword = bcrypt.hashSync(password, salt);

			User.create({ email, password: hashPassword, fullName })
				.then(() => res.render('login'))
				.catch((error) => res.render('signup', { errorMessage: error }));
		})
		.catch((error) => next(error));
});

router.get('/login', (req, res, next) => {
	res.render('login');
});


router.post('/login', (req, res, next) => {
	const { email, password } = req.body;
	if (!email|| !password) {
		res.render('login', {
			errorMessage: 'Username and password are required'
		});
	}

	User.findOne({ email }).then((user) => {
		if (!user) {
			res.render('login', { errorMessage: 'Incorrect user or password' });
		}
		const passwordCorrect = bcrypt.compareSync(password, user.password);
		if (passwordCorrect) {
			req.session.currentUser = user;
			res.redirect('user-profile');
		} else {
			res.render('login', { errorMessage: 'Incorrect email or password' });
		}
	});
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) res.redirect('/');
		else res.redirect('/');
	});
});

function isLoggedIn(req, res, next){
    if(req.session.currentUser) next() 
    else res.redirect("/login")
  }


router.get('/user-profile', isLoggedIn, (req, res)=>{
    if(req.session.currentUser) res.render('user-profile', {user: req.session.currentUser})
    else res.redirect("/")
})








module.exports = router;

