const { Schema, model } = require("mongoose");

const bcryptjs = require('bcryptjs');
const saltRounds = 10;


// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
       unique: true,
    },
    fullName: String,
    email: String,
    passwordHash: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

userSchema.methods.validatePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcryptjs.compare(candidatePassword, this.passwordHash, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

const User = model("User", userSchema);

module.exports = User;
