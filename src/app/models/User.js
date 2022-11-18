import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        "Please add a valid email",
      ],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, (saltError, salt) => {
      if (saltError) {
        return next(saltError);
      }
      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) {
          return next(hashError);
        }

        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

export default model("User", UserSchema);
