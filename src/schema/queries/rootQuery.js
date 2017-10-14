import { Podcast } from "~/schema/types/typeDefs";

const RootQuery = `
type RootQuery {
  podcasts: [Podcast]
  podcastForFeedWithIdentifier(identifier: String!): Podcast
}
`;

export default () => [Podcast, RootQuery];