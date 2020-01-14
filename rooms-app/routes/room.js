
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Room = require("../models/rooms");
const loginCheck = require("../routes/loginCheck");

router.post('/room', (req, res, next) => {
    const {name, description} = req.body;
    const newRoom = new Room({name, description});
    Room.findOne({name: name})
    .then(foundRoom => {
        if (foundRoom){
        return {message: `room name ${foundRoom.name} allready exists`}}
    });
    newRoom.save()
    .then((room) => {
        res.render("private/private");
    })
    .catch(error => {next(error)});
});

router.get('/rooms', (req, res, next) => {
    Room.find()
    .then(allRooms => {
        console.log(allRooms)
        res.render('private/rooms', {rooms: allRooms});
    })
    .catch(error => {next(error)
    });
});

router.get('/rooms_edit', (req, res, next) => {
    if (!req.session.user){
        res.redirect('/rooms');
        return;
    }
    Room.find()
    .then(allRooms => {
        console.log(allRooms)
        res.render('private/rooms_edit', {rooms: allRooms});
    })
    .catch(error => {next(error)
    });
});

router.post('/rooms_edit/:id/delete', (req, res, next) =>{
    if (!req.session.user){
        res.redirect('/rooms');
       // return;
    }
    Room.findByIdAndRemove({'_id': req.params.id})
    .then((room) => {
      res.redirect('/rooms_edit')
    })
    .catch(error => {next(error)}
    );
  });



  router.get('rooms_edit/:id/edit', (req, res, next) =>{
    Room.findOne({'_id': req.params.id})
    .then(someroom => {
      res.render('rooms_edit', {room: someroom});
    })
    .catch(error => {next(error)})
  });


  router.post('/rooms_edit/:id/edit', (req, res, next) =>{
    if (!req.session.user){
        res.redirect('/rooms');
        //return;
    }
    const {name, description} = req.body;
    Room.update({'_id': req.params.id}, {$set: {name, description}}, {new: true})
    .then((room) => {
      res.redirect('/rooms_edit')
    })
    .catch(error => {next(error)}
    );
  });


module.exports = router;

