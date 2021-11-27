//imports
const {Schema, model} = require('mongoose')

//Schema
const userSchema = new Schema({
   name :{
       type:String,
       trim:true,//recorta los espacios del nombre al enviar a DB
       required: [true, 'User name is Required']
   },
   email:{
       type:String,
       unique: true,
       lowercase:true,
       trim:true,
       match:[ /^\S+@\S+\.\S+$/,  'Use a valid email.']
   },
   password:{
       type:String,
       required:[true, 'Password is required']
   },
   imgUrl:String
},{
    timestamps:true
})

//Model
const User = model('User', userSchema)

//Exports
module.exports = User