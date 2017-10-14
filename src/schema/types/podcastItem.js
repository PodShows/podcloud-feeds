import { DateFormat } from '~/schema/enums';
import Episode from "./episode";
import Post from "./post";

const PodcastItem = `
interface PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  url: String!
  author: String
  explicit: Boolean!
}
`;

export default () => [DateFormat, PodcastItem, Episode, Post];