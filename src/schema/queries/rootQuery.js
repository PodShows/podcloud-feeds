import { Podcast, PodcastItem, Playlist } from "~/schema/types/typeDefs";

const RootQuery = `
type RootQuery {
  podcastItem(_id: String!): PodcastItem
  podcast(identifier: String, _id: String): Podcast
  playlist(user_id: String!, _id: String!): Playlist
}
`;

export default () => [Podcast, PodcastItem, Playlist, RootQuery];
