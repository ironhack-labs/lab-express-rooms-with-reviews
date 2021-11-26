//imports
const mongoose = require ('mongoose')
//function
async function connectDB(){
  await mongoose.connect(process.env.MONGODB,{
useNewUrlParser:true,
useUnifiedTopology:true
  })
  console.log("Conectado a la base de datos")
}

//exports
module.exports = connectDB