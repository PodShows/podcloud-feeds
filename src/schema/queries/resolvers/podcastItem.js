import Item from "~/connectors/item"

const podcastItem = function(obj, args, context, info) {
  return new Promise((resolve, reject) => {
    const findArgs = {
      _id: args._id,
      published_at: {
        $lte: new Date()
      },
      status: "published",
      private: {
        $ne: true
      }
    }

    debug("findArgs", findArgs)

    Item.find(findArgs).exec(function(err, item) {
      debug("err:", err)
      debug("item:", item)
      if (err) {
        reject(err)
      } else {
        resolve(item)
      }
    })
  })
}

export default podcastItem
