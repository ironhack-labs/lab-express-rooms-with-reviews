const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// sign-up route
router.get("/sign-up", (req, res, next) => {
  res.render("auth/sign-up");
});

router.post("/sign-up", async (req, res, next) => {
  const { fullName, email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.render("auth/sign-up", { errorMessage: `Please fill out form` });
  }

  // check email format with regex
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    const errorMessage = `This is not a valid email`;
    res.render("auth/sign-up", { errorMessage });
    return;
  }

  // check password strength
  const passwordRegex =
    /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

  if (!passwordRegex.test(password)) {
    return res.render("auth/sign-up", {
      errorMessage: `Password must be at least 8 characters long, includes one or more uppercase and lowercase letters, has at least one digit,
      has one special character
      `,
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    // check if email already is registered
    if (foundUser) {
      return res.render("auth/sign-up", {
        errorMessage: `Email already registered`,
      });
    }

    // encrypt password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { fullName, email, password } = req.body;

  // check if user provide
  if (!fullName || !email || !password) {
    return res.render("auth/login", { errMessage: `Please enter valid data` });
  }

  // check password strength
  const passwordRegex =
    /(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;

  if (!passwordRegex.test(password)) {
    return res.render("auth/login", {
      errorMessage: `Password must be at least 8 characters long, includes one or more uppercase and lowercase letters, has at least one digit,
      has one special character
      `,
    });
  }

  try {
    // check if email exists
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.render("auth/login", { errMessage: `User not found` });
    } else {
      res.render("auth/rooms-profile");
    }

    //check if password matches
    const checkPassword = bcrypt.compareSync(password, foundUser.password);
    if (!checkPassword) {
      return res.render("auth/login", {
        errMessage: `Please enter correct password`,
      });
    }
    // if it does exist, change foundUser to object, delete pw
    const userToObject = foundUser.toObject();
    delete userToObject.password;
    // save current user in session
    req.session.currentUser = userToObject;
    // define global variable
    req.app.locals.currentUser = true;
    res.redirect("/auth/rooms-profile");
  } catch (error) {
    next(error);
  }
});

// logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  req.app.locals.currentUser = false;
  res.render("auth/logout");
});

module.exports = router;
