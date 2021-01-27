import Mongoose from "mongoose";
Mongoose.Promise = global.Promise;

const connect_opts = {
  useMongoClient: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  bufferMaxEntries: 0
};

const connect = (conn_str, opts) => {
  opts.tried++;

  return new Promise((resolve, reject) => {
    Mongoose.connect(conn_str, connect_opts).then(resolve, err => {
      console.error(
        `Failed to connect to MongoDB (${opts.tried}/${opts.retries})`,
        err
      );

      if (opts.tried >= opts.retries) return reject(err);

      const retry_in = Math.floor(opts.tried / 2 * opts.spaced);
      console.error(`Will retry to connect in ${retry_in} seconds`);
      setTimeout(() => resolve(connect(conn_str, opts)), retry_in * 1000);
    });
  });
};

function mongo_connect(conn_str, { retries = 5, spaced = 2 } = {}) {
  return connect(conn_str, { retries, spaced, tried: 0 });
}

export default mongo_connect;
