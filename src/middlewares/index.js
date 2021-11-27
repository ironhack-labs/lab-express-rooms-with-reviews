const isLoggedIn = (req, res, next) => req.session.currentUser ? next() : res.redirect('/auth/login')

const isLoggedOut = (req, res, next) => req.session.currentUser ? res.redirect('/') : next()

module.exports = {
    isLoggedIn,
    isLoggedOut
}