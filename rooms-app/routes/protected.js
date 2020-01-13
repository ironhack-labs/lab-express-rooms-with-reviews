const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const Room = require('../models/room');

//Keep being logged-in !!!
router.get("/", (req, res, next) => {
    res.render("/");
});

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/signin");
    }
});                              

router.get("/protected/createRoom", (req, res, next) => {
    res.render("protected/createRoom");
});

//Create a new room
router.post("/protected/createRoom", (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const owner = req.session.currentUser._id;
    Room.findOne({ "name": name })
    .then((room) => {
        if (room !== null) {
            res.render("protected/createRoom", {
                errorMessage: "This room already exists!"
            });
            return;
        }
        Room.create({
            name,
            description,
            imageUrl,
            owner
        })
        .then(() => {
            res.redirect("/rooms");
        })
    })
    .catch(error => {
        next(error);
    })
});

//edit room
router.get("/protected/editRoom/:id", (req, res, next) => {    
    Room.findOne({ '_id': req.params.id })
    .then(room => {
        if (req.session.currentUser._id.toString() === room.owner.toString()) {
            res.render('protected/editRoom', {room: room} );
        }
    })
    .catch(error => {
        console.log(error);
    });
});

router.post("/protected/editRoom", (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    Room.findByIdAndUpdate({'_id': req.query.id}, {"$set": { "name": name, "description": description, "imageUrl": imageUrl}})
    .then(() => {
        res.redirect("/rooms");
    })
    .catch(error => {
        next(error);
    })
});

router.get("/protected/deleteRoom/:id", (req, res, next) => {
    const roomId = req.params.id;
    console.log("roomId: " + roomId);
    Room.findOne({ "_id": roomId })
    .then((room) => {
        //comp currUser vs rooUser
        console.log("room " + room);
        console.log("SessionUser: " + req.session.currentUser._id + " RoomOwner: " + room.owner);
        if (req.session.currentUser._id.toString() === room.owner.toString()) {
            Room.findByIdAndDelete({ "_id": roomId })
            .then((room) => {
                res.redirect("/rooms");
            })
        }
    });
});

module.exports = router;
