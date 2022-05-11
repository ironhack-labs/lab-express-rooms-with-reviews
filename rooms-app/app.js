// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
 
const session = require('express-session');
const MongoStore = require('connect-mongo');
 
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.model.js');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

const sessionTrack = require("./middleware/sessionTrack");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "rooms-app";

//Partials
hbs.registerPartials(__dirname + "/views/partials");

// app.set('trust proxy', 1);

//session setup
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false, // <== false if you don't want to save empty session object to the store
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1800000 // 60 * 1000 ms === 1 min
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost/rooms-app'
      })
    })
  );

//passport setup
//comes before .initialize


passport.serializeUser((user, cb) => cb(null, user._id));
 
passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});
 
/*
passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    {
      usernameField: 'username', // by default
      passwordField: 'password' // by default
    },
    (req, username, password, done) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Incorrect username' });
          }
 
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password' });
          }
 
          done(null, user);
        })
        .catch(err => done(err));
    }
  )
);
*/
passport.use(new LocalStrategy((username, password, done) => {
  const errorMsg = 'Invalid username or password';

  User.findOne({username})
    .then(user => {
      // if no matching user was found...
      if (!user) {
        return done(null, false, {message: errorMsg});
      }

      // call our validate method, which will call done with the user if the
      // passwords match, or false if they don't
      return user.validatePassword(password)
        .then(isMatch => done(null, isMatch ? user : false, isMatch ? null : { message: errorMsg }));
    })
    .catch(done);
}));


// Passport setup
app.use(passport.initialize());
app.use(passport.session());

app.locals.appTitle = `${capitalized(projectName)}`;

app.use(sessionTrack);

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRouter = require('./routes/auth.routes'); 
app.use('/', authRouter); 

const userRouter = require('./routes/user.routes'); 
app.use('/', userRouter); 

const roomRouter = require('./routes/room.routes'); 
app.use('/room/', roomRouter); 

const reviewRouter = require('./routes/review.routes'); 
app.use('/review/', reviewRouter); 

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
