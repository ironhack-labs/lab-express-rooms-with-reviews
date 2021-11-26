//1. IMPORT
const  mongoose             =require("mongoose")



//2. FUNCTION
async function connectDB(){

    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("Conectado a la base de datos 🔉 ")
}




//3. EXPORT
module.exports = connectDB