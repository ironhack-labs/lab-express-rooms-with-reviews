const isOwner = (req, res, next) => {

	if (req.session.currentUser._id) {
		return next();
	}
	res.redirect("/");
}

module.exports = isOwner