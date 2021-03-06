import { DateFormat } from "~/schema/enums";
import Podcast from "./podcast";
import Episode from "./episode";
import Post from "./post";

const PodcastItem = `
interface PodcastItem {
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
  author: String
  explicit: Boolean!
  podcast: Podcast!
  order_index: Int # Only for playlist items
}
`;

export default () => [DateFormat, Podcast, PodcastItem, Episode, Post];
