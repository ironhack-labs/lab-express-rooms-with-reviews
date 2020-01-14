const express = require('express');
const router = express.Router();
const Room = require('../models/room');

router.get('/', (req, res, next) => {
    Room.find().then(rooms => {
        res.render('rooms/index.hbs', { rooms });
    })
        .catch(err => {
            next(err);
        });
});
router.get('/new', (req, res, next) => {
    const owner = req.session.currentUser.fullName
    console.log("/new user: ", owner);
    res.render('rooms/new.hbs', {owner});
});
router.get('/:id', (req, res, next) => {
    Room.findById(req.params.id)
        .then(room => {
            console.log(room)
            res.render('rooms/rooms', {room});
        })
        .catch(err => {
            next(err);
        });
});
router.post('/', (req, res, next) => {
    
    const { name, description, imageUrl, owner, reviews } = req.body;
    Room.create({ name, description, imageUrl, owner, reviews })
        .then(() => {
            res.redirect('/rooms');
        })
        .catch(err => {
            next(err);
        })
});
router.post('/:id', (req, res, next) => {
    const { name, description, imageUrl} = req.body;
    Room.findByIdAndUpdate(req.params.id, { name, description, imageUrl},{new: true})
        .then((room) => {
            res.redirect('/rooms/' + room._id);
        })
        .catch(err => {
            next(err);
        });
})
router.post('/:id/delete', (req, res, next) => {
    Room.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/rooms');
        })
        .catch(err => {
            next(err);
        })
});
router.get('/:id/edit', (req, res, next) => {
    const owner = req.session.currentUser
    Room.findById(req.params.id)
        .then(room => {
            res.render('rooms/edit', { room , owner} );
        })
        .catch(err => {
            next(err);
        })
});


module.exports = router;