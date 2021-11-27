//imports
const session = require('express-session')
const MongoStore = require('connect-mongo')
//Session's function
const sessionM = (app) =>{
    //secure and flex with external servers (heroku at this time)
    app.set('trust proxy', 1)
    //insert session
    app.use(session({
        secret: process.env.SECRETWORD,
        resave:true,
        saveUninitialized:false,
        cookie:{
            httpOnly:true,
            maxAge:1000 * 60 * 60
        },
        store: MongoStore.create({ //where sending sessions on DB ??
            mongoUrl:process.env.MONGODB
        })
    }))
}
//Exports
module.exports = sessionM