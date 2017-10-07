import Podcast from "./podcast";

const RootQuery = `
type RootQuery {
  podcasts: [Podcast]
  podcastForFeedWithIdentifier(identifier: String!): Podcast
}
`;

export default () => [Podcast, RootQuery];