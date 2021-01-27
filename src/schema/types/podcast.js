import { DateFormat } from "~/schema/enums";
import Cover from "./podcastItem";
import PodcastItem from "./podcastItem";
import Platforms from "./platforms";
import Socials from "./socials";

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
  googleplay_block: Boolean!
  itunes_block: Boolean!
  itunes_category: String
  disabled: Boolean!
  feed_redirect_url: String
  web_redirect_url: String
  platforms: Platforms!
  socials: Socials!
  wiki_url: String
  shop_url: String
  donate_url: String
  items: [PodcastItem]!
  ordering: String!
  _host: String!
}
`;

export default () => [
  DateFormat,
  PodcastItem,
  Podcast,
  Cover,
  Platforms,
  Socials
];
