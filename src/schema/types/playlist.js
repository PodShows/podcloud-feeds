import PodcastItem from "./podcastItem";

const Playlist = `
type Playlist {
  _id: String!
  name: String!
  description: String
  color: String
  items: [PodcastItem]
}
`;

export default () => [PodcastItem, Playlist];
