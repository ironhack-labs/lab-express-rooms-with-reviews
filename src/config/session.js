// Imports
const session = require('express-session')
const MongoStore = require('connect-mongo')



//2. SESSION
const sessionM = (app) =>{
    app.set('trust proxy', 1) //Seguridad y flexibilidad con servidores Cloud
    //Insert Session
    app.use(session({
        secret: process.env.SECRET_WORD,
        resave: true,
        saveUninitialized: false,
        cookie:{
            httpOnly: true,
            maxAge: 1000*60*60
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    }))
}

//3. EXPORT


module.exports = sessionM