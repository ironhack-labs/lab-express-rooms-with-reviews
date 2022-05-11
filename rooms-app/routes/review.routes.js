// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();


const Room = require('../models/Room.model')
const Review = require('../models/Review.model')

const control = require('../middleware/mustBeLoggedIn.js');

router.post("/:id/create", control(), async (req, res, next) => {
    const roomId = req.params.id;
    const {review} = req.body;
    const currentUser = req.session.passport.user;

    try{
        const currentRoom = await Room.findById(roomId);

        if(currentRoom.owner.equals(currentUser)){
            res.redirect(`/room/${roomId}`)
        }else{
            const newReview = await Review.create({user:currentUser,comment:review})
            
            const updateRoom = await Room.findByIdAndUpdate(roomId,{$push: {reviews: newReview._id}});

            res.redirect(`/room/${roomId}`);
        }
    }catch(err){
        res.render("rooms/create",{ attempt: {review}, errorMessage:err })
        console.log(err);
    }
    });  
    
router.get("/:id/create", control(), async (req, res, next) => {
    const homeId = req.params.id;
    const currentUser = req.session.passport.user;
    try{
        const room = await Room.findById(homeId).populate("owner");
        if(room.owner._id.equals(currentUser)){
            room.yours = true;
            res.render("reviews/create",{room: room, errorMessage:'you cannot add a review to your own room'});
        }else{
            room.yours = false;
            res.render("reviews/create",{room: room});
        }
        
    }catch(err){
        console.log(err);
    }
    });    

router.get("/:id/edit", control(), async (req, res, next) => {
    const id = req.params.id;
    const currentUser = req.session.passport.user;
    try{
        const review = await Review.findById(id);
        const reviewOf = await Room.findOne({reviews: id});
        res.render("reviews/edit",{current: {review:review.comment,_id:review._id},reviewOf});
    }catch(err){
        console.log(err);
    }
    });        

router.post("/:id/update",control(), async (req, res, next) => {
    const id = req.params.id;
    const {review} = req.body;
    try{
        const updateReview = await Review.findByIdAndUpdate(id,{comment:review});
        res.redirect(`/`)
    }catch(err){
        res.render(`review/${id}/edit`,{ current: {review,_id}, errorMessage:err })
        console.log(err);
    }
});     

router.post("/:id/delete", control(), async (req, res, next) => {
    const id = req.params.id;
    const currentUser = req.session.passport.user;
    try{
        const review = await Review.findById(id);
        if(review.user.equals(currentUser)){
            const deleteReview = await Review.findByIdAndDelete(id);
            res.redirect(`/`);
        }else{
            console.log('No permission to delete');
            res.redirect(`/`);
        }
    }catch(err){
        res.redirect(`/`)
        console.log(err);
    }
});   
module.exports = router;