const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// importing 'User'-object from Schema-logic:
const User = require("../models/user-model");

// ROUTES:
// 'routes' define what command to execute when entering a specific url
// routing via pattern. VARIABLE_FOR_EXPRESS.METHOD(PATH, OPTIONAL_MIDDLEWARE, HANDLER)
// VARIABLE_FOR_EXPRESS: here 'app', see above
// METHOD: e.g. 'get' or 'post'
// PATH: here '/', path has to start with backslash
// OPTIONAL_MIDDLEWARE: function to do stuff before executing HANDLER
// HANDLER: function to do stuff for specific PATH

router.get("/signup", (request, response) => {
  // rendering page, no backslash:
  response.render("signup");
});

router.post("/signup", (request, response, next) => {
  // User clicks button in signup.hbs, then POST 'request' gets submitted to
  // app.js, then signup.js, then into this route -> 'request' is object which includes values of input fields
  // destructuring both values:
  const { email, password, fullName } = request.body;

  //**note: handling edge cases for empty fields via 'required' in input tags

  // check for existing user, here by 'email'
  User.findOne({ email: email })
    // check returned value, initialized as 'existsAlready', can either be null or !null
    .then((existsAlready) => {
      if (existsAlready != null) {
        response.render("signup", { message: "E-Mail is already in use" });
      } else {
        // encrypting password to 'hash' via bcrypt:
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        // Creating a new user
        // '.create({property1: value1, property2: value2, ...})'
        User.create({ email: email, password: hash, fullName: fullName })
          // after new user is created, redirect to Login page with data:
          .then((user) => {
            // ', {user}'-object is passed on to '/login' page, redirecting to '/login' GET route
            console.log("Successful sign up!");
            response.redirect("/login"); //
          })
          .catch((error) => {
            console.log("Something went wrong at /Signup/: ", error);
            next();
          });
      }
    });
});

// export to make 'router'-logic available to other scripts in this web application
// if not written, Error: "Router.use() requires a middleware function but got an Object"
module.exports = router;
