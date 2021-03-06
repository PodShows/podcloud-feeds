import { DateFormat } from "~/schema/enums/dateFormat";
import Podcast from "./podcast";
import PodcastItem from "./podcastItem";
import Post from "./post";
import Episode from "./episode";
import Enclosure from "./enclosure";
import Cover from "./cover";
import Playlist from "./playlist";

export {
  DateFormat,
  Podcast,
  PodcastItem,
  Post,
  Episode,
  Enclosure,
  Cover,
  Playlist
};

export default () => [
  DateFormat,
  Podcast,
  PodcastItem,
  Post,
  Episode,
  Enclosure,
  Cover,
  Playlist
];
