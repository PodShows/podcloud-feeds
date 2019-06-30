import PodcastItem from "./podcastItem"
import { DateFormat } from "~/schema/enums"
import Enclosure from "./enclosure"

const Episode = `
type Episode implements PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  episode_type: String
  season: Int
  episode: Int
  url: String!
  explicit: Boolean!
  cover_url: String!
  author: String
  enclosure: Enclosure!
}
`

export default () => [PodcastItem, DateFormat, Enclosure, Episode]
