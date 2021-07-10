const User = require('../models/User.model')

module.exports.register((req, res, next)=> {
    res.render("/auth/register")
})
module.exports.doRegister = ((req, res, next) => {
    
})