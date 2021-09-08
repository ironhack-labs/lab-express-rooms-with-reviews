const router = require("express").Router();
const Room = require("../models/Room.model"); 

// ***** (C)REATE ROUTES *****

router.get("/rooms/create", (req, res) => {
  res.render("create-form.hbs");
});

router.post("/rooms/create", (req, res) => {
  const { name, description, imageUrl, owner, reviews } = req.body;
  Room.create({ name, description, imageUrl, owner, reviews })
    .then((data) => {
      res.redirect("/rooms");
    })
    .catch((err) => console.log(err));
});

// ***** (R)EAD ROUTES *****

router.get("/rooms", (req, res, next) => {
  Room.find().then((allRooms) => {
    res.render("rooms-list.hbs", { allRooms });
  });
});

router.get("/rooms/:id", (req, res) => {
  const { id } = req.params;
  Room.findById(id)
    .then((data) => {
      res.render("rooms-details.hbs", { data });
    })
    .catch((err) => console.log(err));
});

// ***** (U)PDATE ROUTES *****

router.get("/rooms/:id/edit", (req, res) => {
  const { id } = req.params;
  Room.findById(id)
    .then((data) => {
      res.render("edit-form.hbs", { data });
    })
    .catch((err) => console.log(err));
});

router.post("/rooms/:id/edit", (req, res) => {
  const { id } = req.params;
  const { name, description, imageUrl, owner, reviews } = req.body;
  Room.findByIdAndUpdate(id, { name, description, imageUrl, owner, reviews })
    .then((data) => {
      res.redirect("/rooms");
    })
    .catch((err) => console.log(err));
});

// ***** (D)ELETE ROUTES *****

router.post("/rooms/:id/delete", (req, res) => {
  const { id } = req.params;
 Room.findByIdAndDelete(id)
    .then((data) => {
      res.redirect("/rooms");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
