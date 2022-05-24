const router = require("express").Router()
const Review = require("../models/Reviews.model");
const isLoggedIn = require("../middlewares/isLoggedIn.js");

router.get("/rooms", isLoggedIn, (req, res) =>{
   res.render("auth/comments")
});

module.exports = router