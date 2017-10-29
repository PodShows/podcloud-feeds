import { DateFormat } from '~/schema/enums';
import PodcastItem from './podcastItem';

const Podcast = `type Podcast {
  title: String!
  identifier: String!
  catchline: String!
  copyright: String
  description: String!
  language: String!
  contact_email: String
  author: String
  cover_url: String!
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
  _host: String!
}
`;

export default () => [DateFormat, PodcastItem, Podcast];