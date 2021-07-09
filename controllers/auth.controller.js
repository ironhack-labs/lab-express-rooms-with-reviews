const User = require('../models/User.model');
const mongoose = require("mongoose");
const passport = require("passport");

module.exports.register = (req, res, next) => {
    res.render('auth/register') // auth/register por Passport. auth no lleva / delante
}

// Registrar al usuario con validación
module.exports.doRegister = (req, res, next) => {
// Comprobar que no existe un usuario con el mismo mail
User.findOne({ email: req.body.email })
    .then((user) => {
        if (!user) {
            if (req.file) {
                console.log(req.file)
                req.body.image = `/uploads/${req.file.filename}`
            }

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
    passport.authenticate('local-auth', (error, user, validations) => {
        if (error) {
            next(error)
        } else if (!user) {
            res.render('auth/login', { user: req.body, errorMessage: validations.error })
        } else {
            req.login(user, (loginErr) => {
                if (loginErr) {
                    next(loginErr)
                } else {
                    res.redirect('/')
                }
            })
        }
    })(req, res, next)
}

// module.exports.logout = (req, res, next) => {
//     req.session.destroy();
//     res.redirect('/main');
// }