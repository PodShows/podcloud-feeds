import moment from "moment"
import { DateFormat } from "~/schema/enums"
import { empty, markdown, sanitize } from "~/utils"
import Podcast from "./podcast"

const Post = {
  _id(item) {
    return item._id.toString()
  },
  guid(item) {
    return item._id.toString()
  },
  title(item) {
    return item.title
  },
  author(item) {
    return !empty(item.author) ? item.author : item.feed.author
  },
  explicit(item) {
    return !!item.explicit
  },
  text_content(item) {
    return sanitize(item.content)
  },
  formatted_content(item) {
    return markdown(item.content)
  },
  published_at(item, args = {}) {
    args.format = args.format || "RFC822"
    return moment.utc(item.published_at).format(DateFormat.resolve(args.format))
  },
  episode_type(item) {
    return /^(full|bonus|trailer)$/.test(item.episode_type)
      ? item.episode_type
      : null
  },
  season(item) {
    return +item.season > 0 ? item.season : null
  },
  episode(item) {
    return +item.episode > 0 ? item.episode : null
  },
  url(item, args, ctx) {
    let url = !empty(item.link)
      ? item.link
      : Podcast._host(item.feed, args, ctx) +
        "/" +
        item._slugs[item._slugs.length - 1]

    if (!/^https?:\/\//.test(url)) url = "http://" + url

    return url
  },
  podcast(item) {
    return item.feed
  }
}

export default Post
