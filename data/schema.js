const typeDefinitions = `
scalar Date

enum DateFormat {
  RFC822
}

type Podcast {
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
}

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

type Post implements PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  url: String!
  author: String
  explicit: Boolean!
}

type Episode implements PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  url: String!
  explicit: Boolean!
  cover_url: String!
  author: String
  enclosure: Enclosure
}

type Enclosure {
  duration: Int!
  size: String!
  type: String!
  url: String!  
}

type RootQuery {
  podcasts: [Podcast]
  podcastForFeedWithIdentifier(identifier: String!): Podcast
}

schema {
  query: RootQuery
}
`;

export default [typeDefinitions];
