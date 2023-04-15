const express = require("express");
const router = express.Router();
const Room = require("../models/room");
const Review = require("../models/review");

router.get("/rooms/:id/reviews/new", (req, res, next) => {
const roomId = req.params.id;
Room.findById(roomId, (err, room) => {
if (err) {
return next(err);
}
res.render("reviews/new", { room });
});
});

router.post("/rooms/:id/reviews", (req, res, next) => {
const roomId = req.params.id;
Room.findById(roomId, (err, room) => {
if (err) {
return next(err);
}
const review = new Review({
user: req.user._id,
comment: req.body.comment,
});
room.reviews.push(review);
room.save((err) => {
if (err) {
return next(err);
}
res.redirect(/rooms/${roomId});
});
});
});