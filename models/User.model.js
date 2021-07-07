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
      }
    },
    {
      timestamps: true
    }
  );

  const User = mongoose.model('User', userSchema);
  module.exports = User;