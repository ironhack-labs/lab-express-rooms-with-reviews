const express = require('express');
const router = express.Router();
const User = require('../models/User.models');
const Room = require('../models/Room.models')
const bcryptjs = require('bcryptjs');
const saltRounds = 10 // SALTI

/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.currentUser;

  if (!user) {
    res.redirect("/login");
    return
  }

  res.render('index', {
    user: req.session.currentUser
  });
});



//login GET
router.get('/login', (req, res) => {
  res.render('auth/login');
})


//Signup GET
router.get('/signup', (req, res) => {
  res.render('auth/register');
})

//Signup Post
router.post('/signup', (req, res) => {
  const {
    username,
    email,
    password
  } = req.body


  bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashed => {
      return User.create({
        username,
        email,
        passwordHash: hashed
      })
    }).then(user => {
      console.log(user);
      req.session.currentUser = user;
      console.log(req.session.currentUser);
      res.redirect('/list')
    }).catch(e => {
      console.log(e);
    })



})

//login post
router.post('/login', (req, res) => {

  const {

    email,
    password
  } = req.body

  User.findOne({
      email
    })
    .then(usuario => {
      if (!usuario) {
        res.render('auth/login', {
          error: "el usuario no esta"
        })
        return
      } else if (bcryptjs.compareSync(password, usuario.passwordHash)) {

        req.session.currentUser = usuario
        res.redirect('/list')
        return

      } else {
        res.render('index', {
          error: "pasword incorrecto"
        })
        return
      }



    }).catch(e => {
      next(e)
    })

})
//Crear GET
router.get('/crear', (req, res) => {

  const user = req.session.currentUser;

  if (!user) {
    res.redirect("/login");
    return
  }


  res.render('room/crearRoom');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

//Crear Post

router.post('/crear', (req, res) => {

  const user = req.session.currentUser;

  if (!user) {
    res.redirect("/login");
    return
  }

  const {
    name,
    imageUrl,
    description
  } = req.body;
  const owner = req.session.currentUser._id
  console.log(req.session.currentUser);

  Room.create({
    name,
    imageUrl,
    description,
    owner
  }).then(prueba => {
    console.log("se creo");
    res.redirect("/list")

  }).catch(e => {
    console.log(e);
  })


});

router.get("/list", (req, res) => {

  const user = req.session.currentUser;

  if (!user) {
    res.redirect("/login");
    return
  }


  Room.find()
    .then((prueba) => {

      res.render("room/listRoom", {
        room: prueba
      })
    }).catch(e => {
      console.log(e);
    })

})


router.get('/rom/:id/delete', (req, res, next) => {

  const user = req.session.currentUser;
  const {
    id
  } = req.params

  if (!user) {
    res.redirect("/login");
    return
  }

  Room.findById(id)
    .then(prueba => {

      const idUser = JSON.stringify(prueba.owner)

      if (idUser === `"${user._id}"`) {
        Room.findByIdAndDelete(prueba._id)
          .then((prueba) => {
            console.log("entro aqui");
            res.redirect('/list')
          })
          .catch(e => next(e))

      } else {



        Room.find()
          .then((prueba) => {

            res.render("room/listRoom", {
              room: prueba,
              error: "No eres el propietario de la publicacion"
            })
          }).catch(e => {
            console.log(e);
          })


      }
    })






});



router.get('/rom/:id/edit', (req, res, next) => {

  const user = req.session.currentUser;
  const {
    id
  } = req.params

  if (!user) {
    res.redirect("/login");
    return
  }

  Room.findById(id)
    .then(prueba => {

      const idUser = JSON.stringify(prueba.owner)

      if (idUser === `"${user._id}"`) {
        res.render("room/editRoom", prueba)
      } else {



        Room.find()
          .then((prueba) => {

            res.render("room/listRoom", {
              room: prueba,
              error: "No eres el propietario de la publicacion"
            })
          }).catch(e => {
            console.log(e);
          })


      }
    })






});



router.post('/rom/:id/edit', (req, res, next) => {

  const {
    name,
    imageUrl,
    description
  } = req.body;

  const user = req.session.currentUser;
  const {
    id
  } = req.params

  if (!user) {
    res.redirect("/login");
    return
  }


  Room.findByIdAndUpdate(id, {
      name,
      imageUrl,
      description
    })
    .then(() => {
      res.redirect("/list")
    })





});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});


module.exports = router;
