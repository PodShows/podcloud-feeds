import Mongoose from "mongoose"
Mongoose.Promise = global.Promise

const connect = (conn_str, opts) => {
  opts.tried++

  return new Promise((resolve, reject) => {
    Mongoose.connect(conn_str, {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0
    }).then(
      () => {
        console.log("Connected to opts")
        resolve()
      },
      err => {
        const retry_in = Math.floor(opts.tried / 2 * opts.spaced)
        console.error(
          `Could not connect to MongoDB (try ${opts.tried}/${
            opts.retries
          }, will retry in ${retry_in} seconds)`,
          err
        )
        if (opts.tried >= opts.retries) {
          reject(err)
        } else {
          setTimeout(() => resolve(connect(conn_str, opts)), retry_in * 1000)
        }
      }
    )
  })
}

function mongo_connect(conn_str, { retries = 5, spaced = 2 } = {}) {
  return connect(conn_str, { retries, spaced, tried: 0 })
}

export default mongo_connect
