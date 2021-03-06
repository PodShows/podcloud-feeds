import PodcastItem from "./podcastItem";
import { DateFormat } from "~/schema/enums";
import Enclosure from "./enclosure";
import Podcast from "./podcast";

const Episode = `
type Episode implements PodcastItem {
  _id: String!
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  episode_type: String
  season: Int
  episode: Int
  url: String!
  podcloud_url: String
  explicit: Boolean!
  author: String
  enclosure: Enclosure!
  podcast: Podcast!
  order_index: Int # Only used for playlist items
}
`;

export default () => [PodcastItem, DateFormat, Enclosure, Episode, Podcast];
