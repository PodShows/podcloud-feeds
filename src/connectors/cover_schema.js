import Mongoose from "mongoose"
Mongoose.Promise = global.Promise

const CoverSchema = new Mongoose.Schema({
  filename: String,
  sha1: String,
  width: Number,
  height: Number,
  squared: Boolean,
  dominant_color: String
})

export default CoverSchema
