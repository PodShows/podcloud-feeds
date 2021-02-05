import path from "path";
import mime from "mime-types";
import { empty, sha256 } from "~/utils";

const Enclosure = {
  duration(enclosure) {
    return Math.max(+enclosure.duration_in_seconds, 0) || 0;
  },
  size(enclosure) {
    return parseInt(enclosure.length, 10) || 0;
  },
  type(enclosure) {
    return (
      mime.lookup(enclosure.media_type) ||
      enclosure.mime_type ||
      "application/octet-stream"
    );
  },
  url(enclosure, args, ctx) {
    const prefix = empty(enclosure.item.feed.url_prefix)
      ? "https://"
      : enclosure.item.feed.url_prefix;

    const identifier = enclosure.item.feed.identifier;
    const item_slug = enclosure.item._slugs[enclosure.item._slugs.length - 1];

    const enclosure_sha256 = empty(enclosure.sha256)
      ? sha256(enclosure.meta_url.path)
      : enclosure.sha256;

    const file_ext = path
      .extname(`${enclosure.filename}`)
      .replace(/(.*)\?.*$/, "$1");

    const enclosure_ext = empty(enclosure.media_type)
      ? file_ext || ".mp3"
      : `.${enclosure.media_type}`;

    return `${prefix}${
      ctx.hosts.stats
    }/${identifier}/${item_slug}/enclosure.${enclosure_sha256}${enclosure_ext}?p=${
      empty(args.purpose) ? "dl" : args.purpose
    }${enclosure.item.preview ? `&preview=${enclosure.item.id}` : ""}`;
  },
  cover(enclosure) {
    let cover = null;

    switch (enclosure.cover_choice) {
      case "detected":
        cover = enclosure.cover_detected;
        break;
      case "custom":
        cover = enclosure.cover_custom;
        break;
      default:
        cover = enclosure.item.feed.feed_cover;
    }

    cover.feed = enclosure.item.feed;
    cover.item = enclosure.item;

    return cover;
  }
};

export default Enclosure;
