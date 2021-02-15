

const {Schema,model} = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
        required:true},
  password: {type:String,
            required:true},
  fullName: {type:String,
            required:true},
  // slack login - optional
  //slackID: String,
  // google login - optional
  //googleID: String
}, {
  timestamps: true
});

module.exports = model('User', userSchema)
