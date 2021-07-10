const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_PATTERN, "Email is invalid"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password is too short"]
    },
    image: {
      type: String,
    },
    googleID: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false
    },
    activationToken: {
      type: String,
      default: () => {
        return Math.random().toString(36).substring(7) +
        Math.random().toString(36).substring(7) +
        Math.random().toString(36).substring(7) +
        Math.random().toString(36).substring(7)
      }
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
  } else {
    next();
  }
})

userSchema.methods.checkPassword = function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
}

const User = mongoose.model("User", userSchema);



module.exports = User;