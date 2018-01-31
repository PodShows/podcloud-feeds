import { empty } from "~/utils"
import Feed from "~/connectors/feed"
import cached from "cached"

const debug = require("debug")(
  "podcloud-feeds:queries:podcastForFeedWithIdentifier"
)

const podcastIdentifiersCache = cached("podcastIdentifiersCache", {
  backend: {
    type: "memory"
  },
  defaults: {
    expire: 300
  }
})

const PodcastFields = [
  "_id",
  "title",
  "catchline",
  "description",
  "identifier",
  "language",
  "contact_email",
  "author",
  "explicit",
  "tags",
  "cover_filename",
  "parent_feed",
  "external",
  "block_itunes",
  "itunes_category",
  "disabled",
  "feed_redirect_url",
  "web_redirect_url",
  "created_at",
  "ordering",
  "updated_at",
  "_slugs"
]

const podcastForFeedWithIdentifier = function(obj, args, context, info) {
  debug("called")
  return new Promise((resolve, reject) => {
    debug("inside promise")
    if (
      typeof args !== "object" ||
      !args.hasOwnProperty("identifier") ||
      empty(args.identifier)
    ) {
      console.error("args.identifier must be a non-empty string!")
      reject("args.identifier must be a non-empty string!")
    }
    const identifier_cleaned = args.identifier.toLowerCase().trim()
    const cache_key = "identifier-uid-" + identifier_cleaned
    debug("Looking for cached uid with key : " + cache_key)
    podcastIdentifiersCache.get(cache_key).then(
      found => {
        let findArgs

        if (!empty(found)) {
          debug("Found cached uid : " + found)
          findArgs = [{ _id: found }, PodcastFields]
        } else {
          debug("Cached uid not found, executing big ass query")
          findArgs = [
            {
              draft: { $ne: true },
              external: { $ne: true },
              $and: [
                {
                  $or: [
                    { feed_to_takeover_id: { $exists: false } },
                    { feed_to_takeover_id: null }
                  ]
                },
                {
                  $or: [
                    { custom_domain: identifier_cleaned },
                    { identifier: identifier_cleaned },
                    { _slugs: identifier_cleaned }
                  ]
                }
              ]
            },
            PodcastFields
          ]
        }

        Feed.findOne(...findArgs).exec(function(err, feed) {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            let keys
            if (feed === null) {
              keys = []
            } else {
              debug("Found podcast.", feed)
              keys = [
                feed.identifier,
                ...feed._slugs,
                feed.custom_domain
              ].filter((item, pos, self) => {
                return self.indexOf(item) == pos && !empty(item)
              })
            }
            if (
              !empty(found) &&
              (keys.indexOf(identifier_cleaned) === -1 || feed === null)
            ) {
              debug(
                "Found podcast doesn't include cached identifier, we need to invalidate cache"
              )
              debug("identifier_cleaned: " + identifier_cleaned)
              debug("keys: ", keys)
              // cached value is not valid anymore
              podcastIdentifiersCache.unset(cache_key).then(
                () => {
                  resolve(null)
                },
                err => {
                  throw err
                }
              )
            } else {
              if (feed !== null) {
                debug("Updating cache with up to date data")
                const feed_id = feed._id.toString()
                const prefix = "identifier-uid-"
                Promise.all(
                  keys.map(k => {
                    debug("Setting cache " + k + "=" + feed_id)
                    return podcastIdentifiersCache.set(prefix + k, feed_id)
                  })
                ).then(
                  () => resolve(feed),
                  err => {
                    /* istanbul ignore next */
                    throw err
                  }
                )
              } else {
                resolve(feed)
              }
            }
          }
        })
      },
      err => {
        /* istanbul ignore next */
        throw err
      }
    )
  })
}

podcastForFeedWithIdentifier.clearCache = function() {
  cached.dropNamedCache("podcastIdentifiersCache")
}

export default podcastForFeedWithIdentifier
