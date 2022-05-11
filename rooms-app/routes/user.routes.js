// routes/auth.routes.js
 
const { Router } = require('express');
const router = new Router();

const Room = require('../models/Room.model')
const Review = require('../models/Review.model')

const control = require('../middleware/mustBeLoggedIn.js');

router.get("/profile",control(), async (req, res, next) => {
    const currentUser = req.session.passport.user;
    try{
        const rooms = await Room.find({owner:{$eq: currentUser}});
        const reviews = await Review.find({user:{$eq: currentUser}});
        res.render("auth/profile",{roomList: rooms,reviewList: reviews});
    }catch(err){
        console.log(err);
    }
   });


module.exports = router;