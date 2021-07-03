const express = require('express');
const router  = express.Router();
const Room = require('../models/room')
const Review = require("../models/review")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

//Show all rooms
router.get('/rooms', (req, res, next) => {
  Room.find()
  .then(rooms => {
    res.render("showRoom", {rooms: rooms})
  })
  .catch(error => {
    console.log(error);
  })
});

router.get("/showDetailRoom/:id", (req, res, next)=>{
  Room.findOne({"_id": req.params.id}).populate("reviews")
  .then(room=>{
    if(room){
       res.render("roomDetail.hbs", {room: room})
    }
    else{
      res.redirect("/showRoom")
    }
  })
  .catch(error => {
    console.log(error);
  })

})

module.exports = router;
