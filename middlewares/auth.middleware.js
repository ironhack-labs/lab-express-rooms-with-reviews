module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.currentUser || req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports.isNotAuthenticated = (req, res, next) => {
  if (req.session.currentUser || req.user) {
    console.log("no autenticado");
    res.redirect("/profile");
  } else {
    next();
  }
};
