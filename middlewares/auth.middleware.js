module.exports = (req, res, next) => {
  console.log(req.user)
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You are not authorized to view this page!. Go to login page!")
  }
}