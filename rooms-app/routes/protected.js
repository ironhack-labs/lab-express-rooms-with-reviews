const express = require('express');
const router  = express.Router();
const User = require('../models/user');
const Room = require('../models/room');
const Review = require('../models/review')
const uploadCloud = require('../config/cloudinary.js');

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
router.post("/protected/createRoom", uploadCloud.single("imageUrl"), (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    let imageUrl = "default";
    if (req.file) {
      imageUrl = req.file.url;
    }
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

router.post("/protected/editRoom", uploadCloud.single("imageUrl"), (req, res, next) => {
    
    const name = req.body.name;
    const description = req.body.description;
    Room.findOne({ 'name': name })
    .then(room => {
        let imageUrl = "default";
        //if specific file was selected in editRooms 
        if(req.file){
            imageUrl = req.file.url;
            }
        //if no file was selected in editRooms but the find has returned an URL
        else if(imageUrl !== ""){
            imageUrl = room.imageUrl;
            }
        //else use default as placeholder url
        Room.findByIdAndUpdate({'_id': req.query.id}, {"$set": { "name": name, "description": description, "imageUrl": imageUrl}})
        .then(() => {
            res.redirect("/rooms");
        })
    })
    .catch(error => {
        next(error);
    })
});

router.get("/protected/deleteRoom/:id", (req, res, next) => {
    const roomId = req.params.id;
    
    Room.findOne({ "_id": roomId })
    .then((room) => {
        //comp currUser vs rooUser
        if (req.session.currentUser._id.toString() === room.owner.toString()) {
            Room.findByIdAndDelete({ "_id": roomId })
            .then((room) => {
                res.redirect("/rooms");
            })
        }
    });
});


//Add Review to Room

router.get("/protected/addReview/:id", (req,res,next)=>{
    Room.findOne({ "_id": req.params.id })
    .then((room) => {
        if (req.session.currentUser._id.toString() !== room.owner.toString()) {
            res.render("protected/addReview", {room: room})
            }
        else{
            res.render("roomDetail.hbs", {room: room});
        }
    });
    
})


router.post("/protected/addReview/:id", (req,res,next)=>{
    const user= req.session.currentUser._id;
    const comment =req.body.comment
    const roomId = req.params.id
   
    Review.create({
        user,
        comment
    })
    .then((review)=>{
            
        Room.findById(roomId)
        .then(room=>{
            room.reviews.push(review._id);
            room.save()
            res.redirect(`/showDetailRoom/${roomId}`)
        })
        //Alternative
        //.findByIdAndUpdate(roomId, {$push: {"reviews": review._id}})
        //res.redirect(`/showDetailRoom/${roomId}`)
    })
    .catch(err=>console.log(err))
})


module.exports = router;
