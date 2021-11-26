// Funciones de Signup
exports.getSignup = (req, res) => {
    res.render("auth/signup")
}

// Funciones de Login
exports.getLogin = (req, res) => {
    res.render("auth/login")
}