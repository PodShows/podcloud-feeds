import PodcastItem from "./podcastItem";
import { DateFormat } from "~/schema/enums";
import Podcast from "./podcast";

const Post = `
type Post implements PodcastItem {
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
}
`;

export default () => [PodcastItem, DateFormat, Post, Podcast];
