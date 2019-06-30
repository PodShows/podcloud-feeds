import PodcastItem from "./podcastItem"
import { DateFormat } from "~/schema/enums"

const Post = `
type Post implements PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  episode_type: String
  season: Int
  episode: Int
  url: String!
  author: String
  explicit: Boolean!
}
`

export default () => [PodcastItem, DateFormat, Post]
