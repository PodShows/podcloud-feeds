import { DateFormat } from "~/schema/enums"
import Cover from "./podcastItem"
import PodcastItem from "./podcastItem"

const Podcast = `type Podcast {
  _id: String!
  title: String!
  identifier: String!
  catchline: String!
  copyright: String
  description: String!
  language: String!
  contact_email: String
  author: String
  cover: Cover!
  created_at(format: DateFormat = RFC822): String!
  updated_at(format: DateFormat = RFC822): String!
  internal: Boolean!
  external: Boolean!
  feed_url: String!
  website_url: String!
  explicit: Boolean!
  tags: [String!]
  itunes_block: Boolean!
  itunes_category: String
  disabled: Boolean!
  feed_redirect_url: String
  web_redirect_url: String
  items: [PodcastItem]!
  ordering: String!
  _host: String!
}
`

export default () => [DateFormat, PodcastItem, Podcast, Cover]
