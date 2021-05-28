const mongoose     = require('mongoose')
const {Schema,model} = mongoose 

const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  owner: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' } ]
})

module.exports = model("rooms",roomSchema) 