const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match:[EMAIL_PATTERN, "Email is invalid"]
        },
        password:{
            type: String,
            required: [true, "Passwrod is required"],
            minLeght:[8, "Password is too short"]
}
    },
    {
        timestamps:true
    }
)
userSchema.pre("save", function (next) {
    //Comprobamos si se ha modificado la contraseña, de no ser asi
    //Detenemos el proceso de hashear para que 
    if (this.isModified("password")) {
        bcrypt.hash(this.password, SALT_ROUNDS)
    }
})
const User = mongoose.model("User", userSchema)
module.exports = User;