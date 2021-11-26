// 1. Importaciones.
const mongoose = require("mongoose")

// 2. Función
async function connectDB() {
    await mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("Base de datos conectada")
}

// 3. Exportación
module.exports = connectDB