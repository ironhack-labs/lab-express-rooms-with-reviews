const session = require('express-session')
const MongoStore = requiere('connect-mongo')(session)
const mongoose = require('mongoose')

module.exports = app =>{
  app.use(
    session({
      secret:process.env.SEESS_SECRET,
      resave:true,
      saveUninitialized:false,
      cookie:{
        sameSite:false,
        httpOnly:true,
        maxAge:6000
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        tll:60*60*24
      })
    })
  )
}