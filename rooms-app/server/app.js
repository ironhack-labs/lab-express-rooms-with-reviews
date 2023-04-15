const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("./models/User");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const roomsRouter = require("./routes/rooms");

const app = express();

// Mongoose configuration
mongoose.connect("mongodb://localhost/rooms-app", {
keepAlive: true,
useNewUrlParser: true,
reconnectTries: Number.MAX_VALUE,
useUnifiedTopology: true,
});
mongoose.set("debug", true);

// Middlewares configuration
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
session({
secret: "my-secret-weapon",
store: new MongoStore({ mongooseConnection: mongoose.connection }),
resave: false,
saveUninitialized: false,
})
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
done(null, user._id);
});

passport.deserializeUser((id, done) => {
User.findById(id, (err, user) => {
if (err) return done(err);
done(null, user);
});
});

passport.use(
new LocalStrategy(
{ passReqToCallback: true },
(req, email, password, next) => {
User.findOne({ email }, (err, foundUser) => {
if (err) return next(err);
if (!foundUser) return next(null, false, { message: "Incorrect email" });
if (!bcrypt.compareSync(password, foundUser.password))
return next(null, false, { message: "Incorrect password" });

return next(null, foundUser);
});
}

)
);

// Routes configuration
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/rooms", roomsRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
// Set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get("env") === "development" ? err : {};

// Render the error page
res.status(err.status || 500);
res.render("error");
});

module.exports = app;