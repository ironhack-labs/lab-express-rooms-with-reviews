//imports
// import express from 'express' <= USAR CON BABEL: Transquilador de código
const express = require("express")
const app = express()

require('dotenv/config')
//console.log(require('dotenv'))

const path = require('path')

//middlewares: Funciones ejecutables despues del req, pero antes del res
//staticFiles: archivos HTML, css, javascript del cliente o imagenes
app.use(express.static(path.join(__dirname, "public")))

//to use req.body
app.use(express.urlencoded({extended:true}))
//vistas
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')



//routes
app.use('/', require('./routes'))

//export app
module.exports = app