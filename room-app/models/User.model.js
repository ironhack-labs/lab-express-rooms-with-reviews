

const {Schema,model} = require('mongoose')

const userSchema = new Schema(
  {
    email: {
            type: String,
            required:true
        },
    passwordHash: {
            type:String,
            required:true
        },


    //slackID: String,
  
    //googleID: String
    
}, {
  timestamps: true
});

module.exports = model('User', userSchema)
