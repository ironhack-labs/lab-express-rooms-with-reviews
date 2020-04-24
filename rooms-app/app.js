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
app.locals.title = "Express - Generated with IronGenerator";

//// Routing:
// read: "if you visit http://localhost:3000/, then show routes/index.hbs"
const index = require("./routes/index");
app.use("/", index);

const signup = require("./routes/signup");
app.use("/", signup);

const login = require("./routes/login");
app.use("/", login);

// export to make 'app'-logic available to other scripts in this web application
module.exports = app;

// define on which port the server should run, 'http://localhost:PORT'
// be aware of async process: 'app.listen()' is called before database connection above is established
app.listen(3000, () => console.log("Running on port 3000"));
