// Making '.env' accessible for sensitive data (Port, Credentials) -> Security
require("dotenv").config();

// Setup of all the packages needed in this web application
// see google for package use case
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport"); // authentication
const bcrypt = require("bcrypt"); // encryption
const LocalStrategy = require("passport-local").Strategy; // authentication
const flash = require("connect-flash"); // error handling
const User = require("./models/user-model");

// 'app' just to shorten function call:
const app = express();

//// Establish database connection, use MongoDB database 'rooms-app' or create if it doesn't exist
mongoose
  // 'useNewUrlParser' to 'make sense' of URL format, if not set: DeprecationWarning
  // 'useUnifiedTopology' to use new method of 'server discovery and monitoring', if not set: DeprecationWarning
  .connect("mongodb://localhost/rooms-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // '.then' to start only after '.connect()' returned a value, with this value (here assigned to 'x') go on:
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  // '.catch' for standard error handling
  .catch((error) => {
    console.error("Error connecting to mongo", error);
  });

//// Setup of debugger:
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

//// Middleware Setup:
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup 'session' secret for authentication/login functionality
app.use(
  session({
    // refer to '.env' for actual secret
    secret: process.env.PASSPORT_LOCAL_SECRET,
    // 'resave' forces session to be saved back to the session store
    resave: true,
    // 'saveUninitialized' = saving a session which is new but not modified
    saveUninitialized: true,
  })
);

//// Passport setup for authentication/login functionality, see lecture
// '.serializeUser' is used to saved user id in the session
passport.serializeUser((user, next) => {
  next(null, user._id);
});

// '.deserializeUser' is used to retrieve the whole User object later via the user id in '.serializeUser'
passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((found) => next(null, found))
    .catch((error) => {
      console.log(error);
      next();
    });
});

// integrate error handling with 'flash'
app.use(flash());

// define passport 'Strategy': local
// 'Strategy' = authentication mechanism
passport.use(
  new LocalStrategy(
    {
      passReqToCallback: true, // enable connect-flash messages
    },
    (request, username, password, next) => {
      // passport.js requires parameter 'username' explicitly for function call
      // !! with 'email: username' you can define 'email' in user-model as a dummy 'username'
      // changing 'username' into 'email' won't work because of passport.js logic
      User.findOne({ email: username })
        .then((found) => {
          if (!found) {
            return next(null, false, { message: "Incorrect e-mail" });
          }
          if (!bcrypt.compareSync(password, found.password)) {
            return next(null, false, { message: "Incorrect password" });
          }
          return next(null, found);
        })
        .catch((error) => {
          console.log(error);
          next();
        });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

//// Express View engine setup:

// make '.scss' stylesheet usable
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

// set path of 'views' folder independent (-> '__dirname') of file location
app.set("views", path.join(__dirname, "views"));

// set 'handlebars/hbs' as the template engine for more convenient linking between JavaScripts and HTML
app.set("view engine", "hbs");

// define where to find the 'content' that doesn't change when running application -> here in 'public' folder
// 'express' doesn't allow serving of static files by default according to 'tutorialspoint.com', have to be set manually:
app.use(express.static(path.join(__dirname, "public")));

// define path of 'favicon' = icon to show in browser tab
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "IronRooms - Generated with IronGenerator";

//// Routing:
// read: "if you visit http://localhost:3000/, then consider routes/index.js"
const index = require("./routes/index");
app.use("/", index);

const signup = require("./routes/signup");
app.use("/", signup);

const login = require("./routes/login");
app.use("/", login);

const roomCrud = require("./routes/room-crud");
app.use("/", roomCrud);

const reviewCrud = require("./routes/review-crud");
app.use("/", reviewCrud);

// export to make 'app'-logic available to other scripts in this web application
module.exports = app;

// define on which port the server should run, 'http://localhost:PORT'
// be aware of async process: 'app.listen()' is called before database connection above is established
app.listen(3000, () => console.log("Running on port 3000"));
