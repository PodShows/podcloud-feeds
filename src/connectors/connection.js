import Mongoose from "mongoose"
Mongoose.Promise = global.Promise

const mongo = {
  conn: null,
  retries: 5,
  tried: 0,
  spaced: 2
}

const connect = conn_str => {
  mongo.tried++

  return Mongoose.connect(
    conn_str,
    {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0
    },
    err => {
      if (err) {
        const retry_in = Math.floor(mongo.tried / 2 * mongo.spaced)
        console.error(
          `Could not connect to MongoDB (try ${mongo.tried}/${
            mongo.retries
          }, will retry in ${retry_in} seconds)`,
          err
        )
        if (mongo.tried >= mongo.retries) {
          process.exit(1)
        } else {
          setTimeout(connect.bind(this, conn_str), retry_in * 1000)
        }
      } else console.log("Connected to MongoDB")
    }
  )
}

function mongo_connect(conn_str) {
  if (!mongo.conn) {
    mongo.conn = connect(conn_str)
  }

  return mongo.conn
}

export default mongo_connect
