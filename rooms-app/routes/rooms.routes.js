const express = require('express');
const Room = require('../models/Room.model');
const User = require('../models/User.model');
// const Movie = require('../models/Movie.model');
const router = express.Router();



function isLoggedIn(req, res, next) {
    if (req.session.currentUser) next() // next invocation tells Express that the middleware has done all it work
    else res.redirect("/auth/login")
}



router.get(
    "/create", isLoggedIn,
    (req, res) => {
        // res.render("rooms/new-room")
        // console.log(req.session.currentUser._id)
        User.findById(req.session.currentUser._id)
            .then((user) => {
                res.render("rooms/new-room", {
                    user
                })
            }).catch((err) => {
                console.log(err)
            });

    })

router.get(
    "/:id",
    (req, res) => {
        Room.findById(req.params.id)
            .populate("owner")
            .then((room) => {
                res.render("rooms/room-details", room)
            }).catch((err) => {
                console.log(err)
            });
    })



// function isOwner(req, res, next) {

//     if (req.session.currentUser) next() // next invocation tells Express that the middleware has done all it work
//     else res.redirect("/auth/login")
// }




router.get("/:id/delete", (req, res) => {
    Room.findById(req.params.id)
        .populate("owner")
        .then((result) => {
            let roomOwner = result.owner.email
            if (req.session.currentUser.email === roomOwner) {

                Room.findByIdAndDelete(req.params.id)
                    .then(deletedRoom => res.redirect("/rooms"))

            }
        }).catch((err) => {
            res.redirect(`/rooms/${req.params.id}`)
        });
})



router.route("/:id/edit")
    .get((req, res) => {
        Room.findById(req.params.id)
            .then(room => res.render("movies/edit-movie", room))

    })
    .post((req, res) => {
        const {
            name,
            description,
            imageUrl,
            owner
        } = req.body
        Room.findByIdAndUpdate(
                req.params.id, {
                    name,
                    description,
                    imageUrl,
                    owner
                }
            )
            .then(updatedRoom => res.redirect(`/rooms/${req.params.id}`))
            .catch(error => console.log(error))
    })




router.post(
    "/create",
    (req, res) => {
        const {
            name,
            description,
            imageUrl,
            owner
        } = req.body
        console.log(name,
            description,
            imageUrl,
            owner)
        Room.create({
                name,
                description,
                imageUrl,
                owner
            })
            .then(newRoom => res.redirect("/rooms"))
            .catch(err => {
                console.log(err)
                res.render("rooms/new-room")
            })
    })

router.get(
    '/',
    (req, res) => { // What URL does this answer?
        Room.find()
            .then(rooms => {
                res.render('rooms/rooms', {
                    rooms
                })
            })
        // You have to continue coding the route
    });

module.exports = router;