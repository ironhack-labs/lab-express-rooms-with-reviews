//Si existe ejecuta next() si no no hay currentUser redirect a auth/login
const isLoggedIn = (req,res,next) => req.session.currentUser ? next() : res.redirect("auth/login")

//Si hay un usuario llevalo al home
const isLoggedOut = (req,res,next) => req.session.currentUser ? res.redirect("/") : next() 

module.exports = { isLoggedIn, isLoggedOut }