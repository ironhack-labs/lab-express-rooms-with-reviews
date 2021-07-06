const mongoose     = require('mongoose')

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String,  maxlength: 200 }
})


module.exports = model("reviews",reviewSchema) 
module.exports = Review;

const Review = mongoose.model("Review", userSchema);

module.exports = Review;
