import { Podcast, PodcastItem } from "~/schema/types/typeDefs";

const RootQuery = `
type RootQuery {
  podcastItem(_id: String!): PodcastItem
  podcast(identifier: String, _id: String): Podcast
}
`;

export default () => [Podcast, PodcastItem, RootQuery];
