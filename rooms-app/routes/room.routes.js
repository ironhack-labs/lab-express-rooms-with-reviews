const { Router } = require('express');
const router = new Router();

const Room = require('../models/Room.model')

const control = require('../middleware/mustBeLoggedIn.js');


router.get("/list", async (req, res, next) => {
    try{
        const rooms = await Room.find().populate("owner");
        res.render("rooms/list",{roomList: rooms});
    }catch(err){
        console.log(err);
    }
   });

router.get("/create", control(), (req, res, next) => {
    console.log(req.session.passport.user);
    res.render("rooms/create");
  });

router.post("/create", control(), async (req, res, next) => {
    const {name, description, imageUrl} = req.body;
    const owner = req.session.passport.user;
    const submission = {name,description,imageUrl,owner}
    try{
        const newRoom = await Room.create(submission);

    }catch(err){
        res.render("rooms/create",{ attempt: {name,description,imageUrl}, errorMessage:err })
        console.log(err);
    }

     res.redirect("/room/list");
    });  

router.get("/:id/edit", control(), async (req, res, next) => {
    const id = req.params.id;
    const currentUser = req.session.passport.user;
    try{
        const room = await Room.findById(id).populate("owner","fullName");
        if(room.owner._id.equals(currentUser)){
            room.yours = true;
        }else{
            res.redirect("/rooms");
        }
        res.render("rooms/edit",{current: room});
    }catch(err){
        console.log(err);
    }
    });    

router.post("/:id/update",control(), async (req, res, next) => {
    const id = req.params.id;
    const {name, description, imageUrl} = req.body;
    const owner = req.session.passport.user;
    const submission = {name,description,imageUrl,owner}
    try{
        const newRoom = await Room.findByIdAndUpdate(id,submission);
        res.redirect(`/room/${id}`)
    }catch(err){
        res.render(`room/${id}/edit`,{ current: {name,description,imageUrl}, errorMessage:err })
        console.log(err);
    }
});     

router.post("/:id/delete", control(), async (req, res, next) => {
    const id = req.params.id;
    const currentUser = req.session.passport.user;
    try{
        const room = await Room.findById(id).populate("owner");
        if(room.owner._id.equals(currentUser)){
            const deleteRoom = await Room.findByIdAndDelete(id);
            res.redirect(`/room/list`);
        }else{
            console.log('No permission to delete');
            res.redirect(`/room/list`);
        }
    }catch(err){
        res.redirect(`/room/list`)
        console.log(err);
    }
});   

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    let currentUser = ''
    console.log();
    if(!req.session.passport){
        currentUser = false;
    }else{
        currentUser = req.session.passport.user;
    }

    try{
        const room = await Room.findById(id)
            .populate("owner", "fullName")
            .populate({path:"reviews",select:"user comment",populate:{path:'user',select:'fullName'}});
        //console.log(JSON.stringify(room));
        if(room.owner._id.equals(currentUser)){
            room.yours = true;
        }else{
            room.yours = false;
        }
        res.render("rooms/view",{roomInfo: room});
    }catch(err){
        console.log(err);
    }
    });

        

module.exports = router;