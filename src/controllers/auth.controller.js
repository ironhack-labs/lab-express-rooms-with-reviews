// Import
const bcryptjs = require('bcryptjs');
const User = require('./../models/User')
const mongoose = require("mongoose")

//-----------------SIGNUP---------------------
exports.getSignup = (req, res) => {
    res.render('auth/signup');

}

//POST
exports.postSignup = async (req, res) => {
    // Get Data from form
    const {
          name,
          email,
          password
    } = req.body;
    //Validations
    if (!name, !email, !password) {
          return res.render('auth/signup', {
                msg: 'All fields required.'
          })    
    }
     //Regex
     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
     if (!regex.test(password)) {
           return res.render('auth/signup', {
                 msg: 'Please include 6 characters, 1 number, 1 upper-case letter, 1 lowercase'
           })
     }
    // Create user
    try {
    // Encript password
    //Veces del hashinhg
        // const salt = await bcryptjs.genSalt(10)
        const salt = await bcryptjs.genSalt(10)
    //Password encriptado
        const hashed = await bcryptjs.hash(password, salt)
    //Crear Usuario
        const createdUser = await User.create({
        name: name,
        email: email,
        password: hashed,
        imgUrl: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png',
    });

    //Crear una sesion dentro del Signup
    req.session.currentUser = {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        imgUrl: createdUser.imgUrl
    }
    // Redireccion
    res.redirect(`/user/${createdUser.name}`)

    } catch (error) {
        //Validar email desde el servidor 
        if (error instanceof mongoose.Error.ValidationError) {
            res.render("auth/signup", {
                msg: "Use a valid email"
            })
        }else if(error.code === 11000){
            res.render("auth/signup", {
                msg: "Email already exist. Try again"
            })
        }
        console.log(error)
    }
}


//-----------------LOGIN---------------------
exports.getLogin = (req,res) =>{

    res.render("auth/login")

}

exports.postLogin = async(req,res) =>{
    //Obtener los datos
    const { email, password } = req.body

    //Find User
    try {
        const findUser = await User.findOne({ email })
        if(!findUser){
            return res.render("auth/login", {
                msg: "User not found"
            })
        }
        // console.log(findUser)
        //CHECK PÀSS:
        const checkPassword = await bcryptjs.compareSync(password, findUser.password)
        if(!checkPassword){
            return res.render("auth/login", {
                msg: "Invalid password"
            })
        }
        req.session.currentUser = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            imgUrl: findUser.imgUrl
        }
        //REDIRECT
        res.redirect(`/user/${findUser.name}`)


    }catch(error){
        console.log(error)
    }
}

//-----------------LOGOUT---------------------
exports.postLogout = async(req,res) =>{
    res.clearCookie("session-token")
    req.session.destroy(err => err ? console.log(e) : res.redirect("/auth/login"))
}