import path from "path"

const Enclosure = {
  duration(enclosure) {
    return Math.max(+enclosure.duration_in_seconds, 0) || 0
  },
  size(enclosure) {
    return parseInt(enclosure.length, 10)
  },
  type(enclosure) {
    return enclosure.mime_type
  },
  url(enclosure, args, ctx) {
    return (
      "https://" +
      ctx.hosts.stats +
      "/" +
      enclosure.item.feed.identifier +
      "/" +
      enclosure.item._slugs[enclosure.item._slugs.length - 1] +
      "/enclosure." +
      +(enclosure.item.updated_at / 1000) +
      path.extname(`${enclosure.filename}`).replace(/(.*)\?.*$/, "$1") +
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
