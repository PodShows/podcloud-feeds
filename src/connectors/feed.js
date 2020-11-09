import Mongoose from "mongoose"
import CoverSchema from "./cover_schema"

Mongoose.Promise = global.Promise

const ObjectId = Mongoose.Schema.Types.ObjectId

const FeedSchema = new Mongoose.Schema({
  title: String,
  catchline: String,
  description: String,
  copyright: String,
  feed_cover: CoverSchema,
  identifier: String,
  url_prefix: String,
  link: String,
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
  web_redirect_url: String,
  itunes: String,
  google_podcasts: String,
  spotify: String,
  deezer: String,
  podcloud: String,
  youtube: String,
  soundcloud: String,
  dailymotion: String,
  twitch: String,
  twitter: String,
  facebook: String,
  instagram: String,
  wiki: String,
  shop: String,
  donate: String
})

const Feed = Mongoose.model("feeds", FeedSchema)

export default Feed
