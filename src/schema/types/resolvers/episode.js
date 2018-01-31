import moment from "moment"
import Podcast from "./podcast"
import { DateFormat } from "~/schema/enums"
import { empty, markdown } from "~/utils"

const Episode = {
  guid(item) {
    return item._id.toString()
  },
  title(item) {
    return item.title
  },
  text_content(item) {
    return item.content
  },
  formatted_content(item) {
    return markdown(item.content)
  },
  author(item) {
    return !empty(item.author) ? item.author : item.feed.author
  },
  explicit(item) {
    return !!item.explicit
  },
  published_at(item, args = {}) {
    args.format = args.format || "RFC822"
    return moment.utc(item.published_at).format(DateFormat.resolve(args.format))
  },
  url(item, args, ctx) {
    let url = !empty(item.link)
      ? item.link
      : "http://" +
        Podcast._host(item.feed, args, ctx) +
        "/" +
        item._slugs[item._slugs.length - 1]
    if (!/^https?:\/\//.test(url)) url = "http://" + url
    return url
  },
  cover_url(item, args, ctx) {
    return (
      "http://" +
      Podcast._host(item.feed, args, ctx) +
      "/" +
      item._slugs[item._slugs.length - 1] +
      "/enclosure/cover.png"
    )
  },
  enclosure(item) {
    item.enclosure.item = item
    return item.enclosure
  }
}

export default Episode
