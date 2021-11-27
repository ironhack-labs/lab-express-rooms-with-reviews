//imports:
const bcryptjs = require('bcryptjs')
const User = require('./../models/User')
const mongoose = require ('mongoose')

exports.getSignup = (req, res)=>{
   res.render('auth/signup')
}

//login functions

exports.getLogin = (req, res)=>{
    res.render('auth/login')
}
//hacemos peticion a base de datos, por eso usamos async




exports.postSignup = async (req, res)=>{
    //conseguimos datos
    const {
        name,
        email, 
        password
    } = req.body
    //validaciones
    if(!name, !email, !password){
        return res.render('auth/signup',{
           msg: 'All fields are required' 
        })
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if(!regex.test(password)){
        return res.render('auth/signup',{
            msg:'Password must include: 6 characters, 1 number, 1 uppercase letter and 1 lowercase'
        })
    }
    
    try {
        //encriptado de password
        //times for hashing
        const salt = await bcryptjs.genSalt(10)
        //hashed password
        const hashed =await bcryptjs.hash(password, salt)
 
        //create user
        const createdUser = await User.create({
            name:name,
            email:email,
            password:hashed, 
            imgUrl: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png'
        })
        //create session
        req.session.currentUser = {
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            imgUrl: createdUser.imgUrl
        }
        //redirect to:
        res.redirect(`/user/${createdUser.name}`)
 
    } catch (error) {
        //validar email desde servidor:
        if(error instanceof mongoose.Error.ValidationError){
             res.render('auth/signup',{
                 msg: 'Use a valid email'
             })
        }else if(error.code === 11000){
            res.render('auth/signup',{
                msg:' User name or email already exist. Try another'
            })
        }
        
    }
 }

 exports.postLogin = async(req, res) =>{
    //get Data
   const { email, password} = req.body
   //Find User
   try {
       const findUser = await User.findOne({email})
       if(!findUser){
           return res.render('auth/login',{
               msg:'User not Found'
           })
       }
       //check password - return boolean value
       const checkedPassword = await bcryptjs.compareSync(password, findUser.password)
       if(!checkedPassword){
          return res.render('auth/login',{
              msg : 'Invalid Password'
          })
       }
     req.session.currentUser ={
        _id:findUser._id,
        name: findUser.name,
        email: findUser.email,
        imgUrl: findUser.imgUr
     }
      //redirect to:
      res.redirect(`/user/${findUser.name}`)

   } catch (error) {
       console.log(error)
   }
}

exports.postLogout = async(req, res)=>{
      res.clearCookie('session-token')
    req.session.destroy( err => err ? console.log(e) : res.redirect('/auth/login')  )
}