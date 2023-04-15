const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

const app = express();

// Database Connection
mongoose.connect("mongodb://localhost/rooms-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Connected to the database"))
  .on("error", (err) => console.log("Error connecting to the database", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/rooms", require("./routes/rooms"));

// Server Listening
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
