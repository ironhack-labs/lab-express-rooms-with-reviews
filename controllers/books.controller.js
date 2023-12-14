const room = require('../rooms-app/models/room.model');

module.exports.list = function(req, res, next) {
  room.find()
    .then(rooms => res.render("rooms/list", { books }))
    .catch(error => next(error));
}

module.exports.details = (req, res, next) => {
  const { id } = req.params;

  Book.findById(id)
    .populate({
      path: 'room',
      populate: {
        path: 'user',
      }
    })
    .then(book => {
      if (book) {
        res.render('roomss/details', book);
      } else {
        res.redirect('/rooms');
      }
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  const { id } = req.params;

  Book.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/rooms');
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const { id } = req.params;

  Book.findById(id)
    .then(rooms => {
      const roomenumValues = room.schema.path('name').enumValues;
      res.render('rooms/form', { rooms ,roomenumValues });
    })
    .catch(next)
}

module.exports.doUpdate = (req, res, next) => {
  const { id } = req.params;
  if (req.file) {
    req.body.image = req.file.path;
  }

  Book.findByIdAndUpdate(id, req.body, { new: true })
    .then(rooms => {
      res.redirect(`/rooms/${rooms._id}`);
    })
    .catch(next)
}

module.exports.create = (req, res, next) => {
  const nameEnumValues = room.schema.path('name').enumValues;
  res.render('rooms/form', { nameEnumValues });
}


module.exports.doCreate = (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path;
  }

  room.create(req.body)
    .then(rooms => {
      res.redirect(`/rooms/${rooms._id}`);
    })
    .catch(next)
}
