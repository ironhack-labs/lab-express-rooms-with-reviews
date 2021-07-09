require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const path         = require('path');
const passport     = require("passport")


require("./config/db.config")

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


//session setup
require("./config/session.config")(app)


//passport

require("./config/passport.config");

app.use(passport.initialize());
app.use(passport.session());


// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded ({ extended: false }));
app.use(cookieParser());

      
hbs.registerPartials(__dirname + "/views/partials")
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// loclals
app.locals.title = 'Express - Generated with IronGenerator';

const currentUserMiddleware = require("./middlewares/currentUser.middleware");
app.use(currentUserMiddleware);


const index = require('./routes/index');
const authRoutes = require("./routes/auth/auth.routes")
app.use('/', index);
app.use("/auth", authRoutes)

app.use((req, res, next) => {
  res.status(404);
  res.render('not-found');
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500);
    res.render('error');
  }
});

module.exports = app