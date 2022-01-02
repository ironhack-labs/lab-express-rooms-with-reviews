const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide a valid email address'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
  },
  username: String,
  slackID: String,
  googleID:String,
},
{
  timestamps: true
}
);

module.exports = model('User', userSchema);
