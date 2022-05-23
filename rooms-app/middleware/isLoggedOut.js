const isLoggedOut = (req, res, next) => {
	
	if (req.session.currentUser) {
		return res.redirect("/");
	}else{
	return next();
}};

module.exports = isLoggedOut;
