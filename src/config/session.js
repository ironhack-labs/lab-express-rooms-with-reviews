// Importaciones.
const session = require("express-session")
const MongoStore = require("connect-mongo")

// Funciones.
const sessionM = (app) => {
    // Seguridad y flexibilidad ante servidores externos.
    app.set('trust proxy', 1)

    // Insertar sesión.
    app.use(session({
        secret: process.env.SECRET_WORD,
        resave: true,
        saveUninitialized: false,
        cookie:{
            httpOnly: true, 
            maxAge: 1000 * 60 * 60
        }, 
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB
        })
    }))
}

// Exportación.
module.exports = sessionM