const Room = require("../models/Room.model");

module.exports = (req, res, next) => {
  // checks if the user is the owner of the room they are trying to delete/edit
  Room.findById(req.params.id)
    .populate("owner")
    .then((results) => {
      console.log("req.session.user: ", req.session.user);
      console.log("results.owner._id", results.owner._id);
      if (req.session.user === results.owner._id.toString()) {
        return res.redirect("/rooms/permission-denied");
      }
      next();
    });
};
