//imports
// import express from 'express' <= USAR CON BABEL: Transquilador de código
const express = require("express")
const app = express()

require('dotenv/config')
//console.log(require('dotenv'))

const path = require('path')
const connectDB = require('./db')

const sessionManager = require ('./config/session')

//middlewares: Funciones ejecutables despues del req, pero antes del res
//staticFiles: archivos HTML, css, javascript del cliente o imagenes
app.use(express.static(path.join(__dirname, "public")))

//to use req.body
app.use(express.urlencoded({extended:true}))
//conect to DB
connectDB();
//session to DB
sessionManager(app)

//layout middleware
//importante para saber si un usuario esta loggeado y checar en las vistas
app.use((req, res, next)=>{
    res.locals.currentUser = req.session.currentUser
    next()
})

//vistas
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')



//routes
app.use('/', require('./routes'))

//login y signup
app.use('/auth', require('./routes/auth.router'))

//Users:
app.use('/user', require('./routes/user.router'))

//ROOMS
app.use('/rooms', require ('./routes/rooms.router'))

//export app
module.exports = app