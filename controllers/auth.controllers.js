const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user.model");




function getSignup(req, res) {
  const { err } = req.query;
  res.render("auth-views/signup", { err });
}

function getLogin(req, res) {
  const { err } = req.query;
  const user = req.session.currentUser;
  res.render("auth-views/login", { err, user });
}

const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

function hasWrongFormat(email, password) {
  return !emailRegex.test(email) || !passwordRegex.test(password);
}

function isValidationError(error) {
  // check if the error object is an instance of mongoose ValidationError contructro function
  return error instanceof mongoose.Error.ValidationError;
}

function isMongoError(error) {
  // when mongo throws an error it gives it the code 11000
  return error.code === 11000;
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
  
    const hasMissingCredentials = !email || !password;

    if (hasMissingCredentials) {
      return res.redirect("/login?error=Missing Credentials");
    }
    // if(hasWrongFormat(email, password)) {
    //     return res.redirect('/login?error=Wrong format')
    // }

    const user = await User.findOne({ email }).lean();
    console.log('user', user)
    if (!user) {
      return res.redirect("/login?error=user not found");
    }
    const hasCorrectPassword = await bcrypt.compare(password, user.password);
    if (hasCorrectPassword) {
      const { password, ...currentUser } = user;
      req.session.currentUser = currentUser;
      return res.redirect("/private");
    }
    return res.redirect("/login?error=wrong password");
  } catch (error) {
    if (isValidationError(error)) {
      return res.redirect("/login?error=validation error");
    }
    if (isMongoError(error)) {
      return res.redirect("/login?error=DB error");
    }
    return res.redirect("/login?error=something went wrong");
  }
}

async function signup(req, res) {
  try {
    const { email, password } = req.body;
    const hasMissingCredentials = !email || !password;
    if (hasMissingCredentials) {
      return res.redirect("/signup?error=Missing Credentials");
    }
    // if (hasWrongFormat(email, password)) {
    //   return res.redirect("/signup?error=Wrong Format");
    // }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { password: unusedVar, ...newUser } = await User.create({
      email,
      password: hashedPassword,
    });

    req.session.currentUser = newUser;

    return res.render("auth-views/firstSignup", { newUser });
  } catch (error) {
    if (isValidationError(error)) {
      return res.redirect("/signup?error=validation error");
    }
    if (isMongoError(error)) {
      return res.redirect("/signup?error=email in use");
    }
    return res.redirect("/signup?err=something went wrong");
  }
}

async function editUser(req, res) {
  try {
    const userID = req.params.id;
    const username = req.body.username;
    const update = { fullName: username };
    const user = await User.findByIdAndUpdate(userID, update, { new: true });
    req.session.currentUser = user;
    res.render("auth-views/home", { user });
  } catch (error) {
    console.error(`Error editing user ${error.name}`);
  }
}

async function logout(req, res) {
  try {
    await req.session.destroy();

    res.redirect("/");
  } catch (error) {
    console.error(`Error logging out ${error.name}`);
  }
}


module.exports = {
  getLogin,
  getSignup,
  signup,
  login,
  logout,
  editUser,
};
