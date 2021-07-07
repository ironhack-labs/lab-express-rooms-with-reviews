require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const hbs = require("hbs");

// Connection to DB
require('./config/db.config');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(logger('dev'));
app.set('views', __dirname + "/views");
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Routes
const routes = require('./routes/routes');
app.use('/', routes);

// Error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((error, req, res, next) => {
  console.log(error);
  if (!error.status) {
    error = createError(500);
  }
  res.status(error.status);
  res.render("error", error);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});