function isNotLoggedIn(req, res, next) {
	if (req.session.currentUser) {
		res.redirect('/private/profile');
	} else {
		next();
	}
}

module.exports = isNotLoggedIn;
