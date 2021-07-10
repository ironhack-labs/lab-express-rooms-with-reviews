const session = require('express-session');
const MongoStore = require('connect-mongo');

const { db } = require('./constants')


module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'I LOVE COOKIES',
      resave: true, 
      saveUninitialized: false,
      cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 *24
      },
      store: MongoStore.create({
        mongoUrl: db
      })
    })
  )
}