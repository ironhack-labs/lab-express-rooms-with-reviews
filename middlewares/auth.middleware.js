module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      res.redirect('/login')
    }
  }

  module.exports.isNotAuthenticated = (req, res, next) => {
    if (req.isUnauthenticated()) {
      next()
    } else {
      res.redirect('/profile')
    }
  }