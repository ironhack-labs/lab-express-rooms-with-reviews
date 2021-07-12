const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
    {
      email: {
          type: String,
          required: [true, 'email is required'],
          unique: true,
          trim: true, //Para quitar los espacios en blanco
          lowercase: true,
          match: [EMAIL_PATTERN, 'email is invalid']
      },
      password: {
          type: String,
          required: [true, 'password is required'],
          minLenght: [8, 'password is invalid']
      },
      image: {
        type: String
      }
    },
    {
      timestamps: true
    }
  );

  //Encriptar contraseña
  userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
      bcrypt.hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
    } else {
      next();
    }
  })

  // Comparar la contraseña introducida para ver si es la misma
  userSchema.methods.checkPassword = function(passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password)
  }

  const User = mongoose.model('User', userSchema);
  module.exports = User;