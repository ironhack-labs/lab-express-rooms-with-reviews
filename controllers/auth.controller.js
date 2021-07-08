const User = require('../models/User.model');

module.exports.register = (req, res, next) => {
    res.render('auth/register') // auth/register por Passport. auth no lleva / delante
}

// Registrar al usuario con validación
module.exports.doRegister = (req, res, next) => {
// Comprobar que no existe un usuario con el mismo mail
User.findOne({ email: req.body.email })
    .then((user) => {
        if (!user) {
            User.create(req.body)
            .then(() => {
                res.redirect('/')
            })
            .catch(e => {
                if (e instanceof mongoose.Error.ValidationError) {
                    res.render('auth/register', { user: req.body, errors: e.errors })
                } else {
                    next(e)
                }
            })
        } else {
            res.render('auth/register', { user: req.body, errors: { email: 'There is already an accound with that email' } })
        }
    })
    .catch(e => next(e))
}

module.exports.login = (req, res, next) => {
    res.render('auth/login')
}

module.exports.doLogin = (req, res, next) => {
    
}