import Mongoose from "mongoose"
Mongoose.Promise = global.Promise

function mongo_connect(conn_str) {
  const mongo = Mongoose.connect(
    conn_str,
    {
      useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0
    },
    err => {
      if (err) {
        console.error("Could not connect to MongoDB on port 27017")
      }
    }
  )

  return mongo
}

export default mongo_connect
