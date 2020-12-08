import Item from "~/connectors/item"
import Feed from "~/connectors/feed"

const debug = require("debug")("podcloud-feeds:queries:podcastItem")

const podcastItem = function(obj, args, context, info) {
  return new Promise((resolve, reject) => {
    const findArgs = {
      _id: args._id,
      status: "published",
      private: {
        $ne: true
      }
    }

    debug("findArgs", findArgs)

    Item.findOne(findArgs).exec(function(err, item) {
      debug("err:", err)
      debug("item:", item)
      if (err) {
        reject(err)
      } else {
        if (item && item.feed_id) {
          Feed.findOne({ _id: item.feed_id }).exec(function(err, feed) {
            if (err) {
              console.error(err)
              reject(err)
            } else {
              debug("Got a feed", feed)
              item.feed = feed
              resolve(item)
            }
          })
        } else {
          resolve(null)
        }
      }
    })
  })
}

export default podcastItem
