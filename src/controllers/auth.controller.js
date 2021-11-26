// Importaciones
const bcryptjs = require("bcryptjs")
const User = require("./../models/User")

// Funciones de Signup
exports.getSignup = (req, res) => {
    res.render("auth/signup")
}

//
exports.postSignup = async(req, res) => {
    
    //Obtener datos del formulario
    const { 
        name, 
        email, 
        password 
    } = req.body

    // Validaciones.
    if(!name, !email, !password) {
        return res.render("auth/signup",{
            MessageChannel: "All fields are required"
        } )
    }

    // Regex
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if(!regex.test(password)) {
        return res.render("auth/signup", {
            msg: "Please include 6 characters, 1 number, 1 uppercase, 1 lowercase"
        })
    }

    // Create user
    try {
        // Encriptar password
        // Veces que se va a revolver la contraseña
        const salt = await bcryptjs.genSalt(10)
        // Contraseña cifrada.
        const hashed = await bcryptjs.hash(password, salt)
        
        // Crear usuario.
        const createdUser = await User.create({
            name,
            email,
            password: hashed,
            imgUrl: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png"
        })

        // Crear una sesión.
        req.session.currentUser = {
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            imgUrl: createdUser.imgUrl
        }

        // Redirección.
        res.redirect (`user/${createdUser.name}`)

    } catch (error) {
        
    }
}

// Funciones de Login
exports.getLogin = (req, res) => {
    res.render("auth/login")
}

exports.postLogin = async(req, res) => {

    // Obtener datos del formulario.
    const { email, password } = req.body

    // Encontrar al usuario.
    try {
        const findUser = await User.findOne({email})
        // Validaciones.

        if(!findUser) {
            return res.render("auth/login", {
                msg: "User nor Found"
            })
        }

        // Verificar contraseña. Devuelve booleano
        const checkedPassword = await bcryptjs.compareSync(password, findUser.password)

        if(!checkedPassword) {
            return res.render("auth/login", {
                msg: "Invalid Password"
            })
        } 

        req.session.currentUser = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            imgUrl: findUser.imgUrl
        }
        // Redireccionar
        res.redirect(`/user/${findUser.name}`)

    } catch (error) {
        console.log(error)
    }
}

// Función logout
exports.postLogout = async(req, res) => {
    res.clearCookie("session-token")
    req.session.destroy(err => err ? console.log(e) : res.redirect("/auth/login"))
}