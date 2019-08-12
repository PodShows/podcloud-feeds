import Mongoose from "mongoose"
import CoverSchema from "./cover_schema"

Mongoose.Promise = global.Promise

const ObjectId = Mongoose.Schema.Types.ObjectId

const EnclosureUrlSchema = new Mongoose.Schema({
  path: String
})

const EnclosureSchema = new Mongoose.Schema({
  duration_in_seconds: Number,
  length: String,
  mime_type: String,
  meta_url: EnclosureUrlSchema,
  cover_detected: CoverSchema,
  cover_custom: CoverSchema,
  cover_choice: String
})

const ItemSchema = new Mongoose.Schema({
  feed_id: ObjectId,
  title: String,
  explicit: Boolean,
  author: String,
  link: String,
  status: String,
  _slugs: [String],
  content: String,
  published_at: Date,
  updated_at: Date,
  private: Boolean,
  episode_type: String,
  season: Number,
  episode: Number,
  inferred_type_season_and_episode: Boolean,
  enclosure: EnclosureSchema
})

const Item = Mongoose.model("items", ItemSchema)

export default Item
