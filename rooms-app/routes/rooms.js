const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Review = require("../models/Review");

router.get("/", (req, res) => {
    Room.find() 
    .then((roomsFromDB) => res.render("rooms/index", { rooms: roomsFromDB }))
    .catch((err) => next(err));
});

router.get('/create', (req, res) => {
    if (!req.user) {
      res.redirect('/auth/login'); 
      return;
    }
    
    res.render('rooms/create', { user: req.user });
});

router.post("/create", (req, res) => {
    const { name, description, imageUrl } = req.body;
    Room.create({ name, description, imageUrl, owner: req.user })
    .then(() => {
        res.redirect('/rooms')
    })
    .catch((err) => {
        console.log(`Error while creating a new room: ${err}`)
        res.render('rooms/index')
    })
});

  router.get('/myrooms', (req, res) => {
    if (!req.user) {
      res.redirect('/auth/login'); 
      return;
    }
    
    

    Room.find({ owner: req.user }) 
    .then((roomsFromDB) => {
    if(roomsFromDB[0] == null){
        res.render("rooms/myrooms", { message: "You dont have any rooms yet." });
    } else{
        res.render('rooms/myrooms', { message: "Here are your rooms:",
    rooms : roomsFromDB });
    }
    })
    .catch((err) => next(err));
  });

  router.get('/details/:roomId', (req, res, next) => {
    const { roomId } = req.params
    Room.findById(roomId)
        .populate('reviews')
        .populate({
            path: 'reviews',
            populate: {
              path: 'user',
              model: 'User'
            }
        })
        .then(roomFromDb => {
            res.render('rooms/details', {oneroom: roomFromDb})
        })
        .catch(e => {
            console.log('error while getting room', e)
            next(e)
        })
})

router.get('/edit/:roomId', (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
      }
   
    const { roomId } = req.params;
    Room.find({ _id: roomId, owner: req.user })
    .then(roomToEdit => {
    if(roomToEdit == null){
        res.render('rooms/edit', {message: 'You are not the owner of this room.'});
    } else{
        res.render('rooms/edit', {message: "Please edit your room.", room: roomToEdit[0]}); 
    }
    })    
    .catch((err) => next(err));
});

router.post('/edit/:roomId', (req, res, next) => {
    const { roomId } = req.params;
    const { name, description, imageUrl } = req.body;

    Room.findByIdAndUpdate(roomId, { name, description, imageUrl }, { new: true })
      .then(updatedRoom => res.redirect('/rooms/myrooms'))
      .catch(error => next(error));
});

router.post('/delete/:roomId', (req, res) => {
    const { roomId } = req.params;

    Room.findByIdAndDelete(roomId)
      .then(() => res.redirect('/rooms/myrooms'))
      .catch(error => next(error));
});

router.post("/review/:roomId", (req, res) => {
    const { roomId } = req.params;
    if (!req.user) {
        res.redirect(`/auth/login`); 
        return;
    }
    const { comment } = req.body;
    console.log(req.user)
    Room.find({ _id: roomId, owner: req.user._id })
    .then(roomToComment => {
    if(roomToComment[0] == null){
        Review.create({ comment, user: req.user })
        .then((newComment) => {
        return Room.findByIdAndUpdate(roomId, { $push: { reviews: newComment._id } });
        })
    } 
    })    
    .then(() => res.redirect(`/rooms/details/${roomId}`))
    .catch((err) => {
        // console.log(`Error while creating a new comment: ${err}`)
        res.render('rooms/index')
    })
});

module.exports = router; 