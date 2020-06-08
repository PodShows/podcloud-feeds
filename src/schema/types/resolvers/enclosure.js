import path from "path"
import mime from "mime-types"
import { empty } from "~/utils"

const Enclosure = {
  duration(enclosure) {
    return Math.max(+enclosure.duration_in_seconds, 0) || 0
  },
  size(enclosure) {
    return parseInt(enclosure.length, 10) || 0
  },
  type(enclosure) {
    return (
      mime.lookup(enclosure.media_type) ||
      enclosure.mime_type ||
      "application/octet-stream"
    )
  },
  url(enclosure, args, ctx) {
    return (
      (empty(enclosure.item.feed.url_prefix)
        ? ""
        : enclosure.item.feed.url_prefix) +
      "https://" +
      ctx.hosts.stats +
      "/" +
      enclosure.item.feed.identifier +
      "/" +
      enclosure.item._slugs[enclosure.item._slugs.length - 1] +
      "/enclosure." +
      Math.round(enclosure.item.updated_at / 1000) +
      ((!empty(enclosure.media_type)
        ? `.${enclosure.media_type}`
        : path.extname(`${enclosure.filename}`).replace(/(.*)\?.*$/, "$1")) ||
        ".mp3") +
      "?p=f"
    )
  },
  cover(enclosure) {
    let cover = null

    switch (enclosure.cover_choice) {
      case "detected":
        cover = enclosure.cover_detected
        break
      case "custom":
        cover = enclosure.cover_custom
        break
      default:
        cover = enclosure.item.feed.feed_cover
    }

    cover.feed = enclosure.item.feed
    cover.item = enclosure.item

    return cover
  }
}

export default Enclosure
