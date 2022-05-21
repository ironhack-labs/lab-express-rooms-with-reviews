const router = require("express").Router()
const Review = require("../models/Reviews.model");

router.get("/", (req, res) =>{
   res.render("comments")
});

module.exports = router