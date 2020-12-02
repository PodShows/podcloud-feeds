import moment from "moment"
import Item from "~/connectors/item"
import { DateFormat } from "~/schema/enums"
import { empty, nullIfEmpty } from "~/utils"

import path from "path"

const debug = require("debug")("podcloud-feeds:types:resolvers:podcast")

const platform_subdomains = ["faq", "blog", "devblog", "astuces", "changelog"]

const Podcast = {
  _id(feed) {
    return feed._id.toString()
  },
  title(feed) {
    return feed.title
  },
  identifier(feed) {
    return feed.identifier
  },
  catchline(feed) {
    return feed.catchline
  },
  description(feed) {
    return feed.description
  },
  copyright(feed) {
    return feed.copyright
  },
  language(feed) {
    return feed.language
  },
  contact_email(feed) {
    return feed.contact_email
  },
  author(feed) {
    return feed.author
  },
  created_at(feed, args = {}) {
    args.format = args.format || "RFC822"
    return moment.utc(feed.created_at).format(DateFormat.resolve(args.format))
  },
  updated_at(feed, args = {}) {
    args.format = args.format || "RFC822"
    return moment.utc(feed.updated_at).format(DateFormat.resolve(args.format))
  },
  internal(feed) {
    return !feed.external
  },
  external(feed) {
    return feed.external
  },
  cover(feed, args, ctx) {
    feed.feed_cover.feed = feed
    return feed.feed_cover
  },
  feed_url(feed, args, ctx) {
    let url = feed.external
      ? feed.parent_feed
      : `${Podcast._host(feed, args, ctx)}/rss`

    if (!/^https?:\/\//i.test(url)) url = "http://" + url

    return url
  },
  website_url(feed, args, ctx) {
    let url = !empty(feed.link)
      ? feed.link
      : `${Podcast._host(feed, args, ctx)}/`

    if (!/^https?:\/\//i.test(url)) url = "http://" + url

    return url
  },
  explicit(feed) {
    return !!feed.explicit
  },
  tags(feed) {
    return (feed.tags || "").split(",")
  },
  googleplay_block(feed) {
    return !!feed.block_google_podcasts
  },
  itunes_block(feed) {
    return !!feed.block_itunes
  },
  itunes_category(feed) {
    return feed.itunes_category
  },
  disabled(feed) {
    return !!feed.disabled
  },
  feed_redirect_url(feed) {
    if (empty(feed.feed_redirect_url)) {
      return null
    }
    let fru = feed.feed_redirect_url

    if (!/^https?:\/\//i.test(fru)) fru = "http://" + fru
    return fru
  },
  web_redirect_url(feed) {
    if (empty(feed.web_redirect_url)) {
      return null
    }
    let wru = feed.web_redirect_url

    if (!/^https?:\/\//i.test(wru)) wru = "http://" + wru
    return wru
  },
  ordering(feed) {
    return feed.ordering == "asc" ? "asc" : "desc"
  },
  platforms(feed) {
    feed.podcloud = feed.visible_in_directory ? feed.identifier : null
    feed.apple = feed.itunes
    feed.google = feed.google_podcasts

    return [
      ["apple", `https://podcasts.apple.com/`],
      ["google", ``],
      ["spotify", `https://open.spotify.com/show/`],
      ["deezer", `https://deezer.com/`],
      ["podcloud", `https://podcloud.fr/podcast/`]
    ].reduce((acc, [platform, prefix]) => {
      const val = nullIfEmpty(feed[platform])

      acc[platform] = val
      acc[`${platform}_url`] = val === null ? null : `${prefix}${val}`
      return acc
    }, {})
  },
  socials(feed) {
    return {
      youtube: nullIfEmpty(feed.youtube),
      soundcloud: nullIfEmpty(feed.soundcloud),
      dailymotion: nullIfEmpty(feed.dailymotion),
      twitch: nullIfEmpty(feed.twitch),
      twitter: nullIfEmpty(feed.twitter),
      facebook: nullIfEmpty(feed.facebook),
      instagram: nullIfEmpty(feed.instagram),
      discord: nullIfEmpty(feed.discord)
    }
  },
  wiki_url(feed) {
    let url = feed.wiki

    if (empty(url)) return null

    if (!/^https?:\/\//i.test(url)) url = "http://" + url

    return url
  },
  shop_url(feed) {
    let url = feed.shop

    if (empty(url)) return null

    if (!/^https?:\/\//i.test(url)) url = "http://" + url

    return url
  },
  donate_url(feed) {
    let url = feed.donate

    if (empty(url)) return null

    if (!/^https?:\/\//i.test(url)) url = "http://" + url

    return url
  },
  items(feed) {
    return new Promise((resolve, reject) => {
      const findArgs = {
        feed_id: feed._id,
        published_at: {
          $lte: new Date()
        },
        status: "published",
        private: {
          $ne: true
        }
      }

      debug("findArgs", findArgs)

      Item.find(findArgs, null, {
        sort: {
          published_at: feed.ordering == "asc" ? 1 : -1
        }
      }).exec(function(err, items) {
        debug("err:", err)
        debug("items:", items)
        if (err) {
          reject(err)
        } else {
          resolve(
            items
              .filter(i => !!i && typeof i === "object" && !Array.isArray(i))
              .map(item => {
                item.feed = feed
                return item
              })
          )
        }
      })
    })
  },
  _host(feed, args, ctx) {
    let host = ctx.hosts.podcasts

    if (platform_subdomains.includes(feed.identifier)) host = ctx.hosts.platform

    return `https://${feed.identifier}.${host}`
  }
}

export default Podcast
