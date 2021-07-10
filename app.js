const express = require('express')
const logger = require('morgan')
const hbs=require('hbs')

//Conexion a la BD
require('./config/db.config')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(logger('dev'))
app.set('views',__dirname + '/views')
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials')

//Rutas
const routes = require('./config/routes')
app.use('/', routes)

//Error handler
app.use((req, res, next) => {
    next(createError(404))
})
//Middleware que intercepta errores
app.use((error, req, res, next) => {
    console.log(error)
    if (!error.status) {
        error=createError(500)
    }
    res.status(error.status)
    res.render("error", error)
})
const PORT = 3000
app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))