//1. IMPORT
const express           =require("express")
const app               =express()

require("dotenv").config()
// console.log(require("dotenv"))

const path              =require("path")
const connectDB         =require("./db")

const sessionManager    =require("./config/session") 

//2. MIDDLEWARES
//Son funciones que se ejecutan despues de pedir un request y antes de la respuesta del servidor
//Static files - HTML - CSS - JS - IMAGES
app.use(express.static(path.join(__dirname, "public"))) // como se usa .join no se usa / de la muerte

//VIEWS
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs") //hbs se usa para las views

//To use req.body configura 
app.use(express.urlencoded({ extended:true }))

//Conectar BD
connectDB()

//Session
sessionManager(app)

//LayOut Middleware
//Importante para saber si un usuario esta loggeado y checar en las vistas
//cada vez que accedemos a una nueva vista verifica si existe ese user
app.use((req,res,next) =>{
    res.locals.currentUser = req.session.currentUser
    next()
})

//3. Routes
//Home:
app.use("/", require("./routes")) // si se llama index, puedo no poner nada despues del routes

//Login y Signup
app.use("/auth", require("./routes/auth.Routes"))

//Users
app.use("/user", require("./routes/user.Routes"))

//Rooms
app.use("/rooms", require("./routes/rooms.Routes"))

//4. EXPORT
module.exports = app