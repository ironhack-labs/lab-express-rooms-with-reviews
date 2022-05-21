isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

module.exports = { isLoggedIn };
