const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "sample secret",
      resave: true,
      saveUninitialized: true, 
      cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      },
      store: MongoStore.create({
        mongoUrl: "mongodb://localhost/ironrooms"
      })
    })
  );
}