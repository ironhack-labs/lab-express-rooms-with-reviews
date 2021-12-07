var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var roomsRouter = require('./routes/rooms');

//connects to DB
require("./db")

// "connect-mongo" together with "express-session" helps us save the session in the DB
const session = require("express-session");
const MongoSessionStore = require("connect-mongo")

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth";

// set our session
app.use(session(
  {
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },    
    store: MongoSessionStore.create(
      { 
        ttl: 24 * 60 * 60, 
        mongoUrl: MONGO_URI
      }),
    resave: false,
    saveUninitialized: true
  }
))

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
