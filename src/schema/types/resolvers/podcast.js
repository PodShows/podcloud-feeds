import moment from "moment"
import Item from "~/connectors/item"
import { DateFormat } from "~/schema/enums"
import { empty } from "~/utils"

import path from "path"

const debug = require("debug")("podcloud-feeds:types:resolvers:podcast")

const ItemFields = [
  "_id",
  "title",
  "content",
  "author",
  "published_at",
  "enclosure",
  "_slugs"
]

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
  cover_url(feed, args, ctx) {
    return (
      "http://" +
      Podcast._host(feed, args, ctx) +
      "/cover" +
      (empty(feed.cover_filename) ? ".png" : path.extname(feed.cover_filename))
    )
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
  itunes_block(feed) {
    return feed.block_itunes
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

      Item.find(findArgs, ItemFields, {
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
            items.map(item => {
              item.feed = feed
              return item
            })
          )
        }
      })
    })
  },
  _host(feed, args, ctx) {
    if (!empty(feed.custom_domain)) return feed.custom_domain

    let host = ctx.hosts.podcasts

    if (platform_subdomains.includes(feed.identifier)) host = ctx.hosts.platform

    return `${feed.identifier}.${host}`
  }
}

export default Podcast
