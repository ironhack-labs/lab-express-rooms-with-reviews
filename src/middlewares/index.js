const isLoggedIn = (req, res, next) => req.session.currentUser ? next() : res.redirect("/auth/login") // operador ternario, en vez del if, si se cumple la condición pasa a next, los : serían el else, se redirige a login

const isLoggedOut = (req, res, next) => req.session.currentUser ? res.redirect("/") : next()

module.exports = {
    isLoggedIn,
    isLoggedOut
}