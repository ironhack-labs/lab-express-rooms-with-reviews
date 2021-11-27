// 1. Importaciones

const express = require("express")
// import express from "express" // ECMAS 6, node no está actualizado, por ahora no funciona, hay varias formas de escribir todo
const app = express()

require("dotenv").config() // activa variables de entorno

const path = require("path")

const connectDB = require("./db")

const sessionManager = require("./config/session")

// 2. Middlewares

// Archivos estáticos, hace la conexión con carpeta public 
app.use(express.static(path.join(__dirname, "public"))) // ya no es necesario poner la /

// Vistas
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

// Para usar el req.body, para obtener los datos de los formularios
app.use(express.urlencoded({extended:true}))

// Conectar a BD.
connectDB()

// Sesiones.
sessionManager(app)

// Layout middleware. Para saber si un usuario está loggeado y checar en las vistas
app.use((req, res, next) => {
    res.locals.currentUser = req.session.currentUser
    next()
})

// 3. Rutas
// Home
app.use("/", require("./routes"))

// Login y signup
app.use("/auth", require("./routes/auth.router"))

// Users
app.use("/user", require("./routes/user.router"))

// Rooms.
app.use("/rooms", require("./routes/rooms.router"))

// 4. Exportación

module.exports = app