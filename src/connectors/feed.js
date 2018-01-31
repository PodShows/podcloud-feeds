import Mongoose from "mongoose"
Mongoose.Promise = global.Promise

const ObjectId = Mongoose.Schema.Types.ObjectId

const FeedSchema = new Mongoose.Schema({
  title: String,
  catchline: String,
  description: String,
  copyright: String,
  cover_filename: String,
  identifier: String,
  custom_domain: String,
  feed_to_takeover_id: ObjectId,
  language: String,
  contact_email: String,
  author: String,
  explicit: Boolean,
  draft: Boolean,
  tags: String,
  _slugs: [String],
  parent_feed: String,
  external: Boolean,
  created_at: Date,
  updated_at: Date,
  ordering: String,
  block_itunes: Boolean,
  itunes_category: String,
  disabled: Boolean,
  feed_redirect_url: String,
  web_redirect_url: String
})

const Feed = Mongoose.model("feeds", FeedSchema)

export default Feed
