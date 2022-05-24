const isLoggedIn = (req, res, next) => {
	if (!req.session.currentUser) {
	  return res.redirect('/signin');
	}
	next();
  };

module.exports = isLoggedIn;