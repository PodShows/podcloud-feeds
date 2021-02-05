import path from "path";
import { empty, nullIfEmpty } from "~/utils";

import Feed from "~/connectors/feed";

const debug = require("debug")("podcloud-feeds:types:resolvers:playlist");

const Playlist = {
  _id(playlist) {
    return playlist._id.toString();
  },
  name(playlist) {
    return playlist.name;
  },
  description(playlist) {
    return playlist.description;
  },
  color(playlist) {
    return playlist.color;
  },
  items(playlist) {
    return new Promise((resolve, reject) => {
      playlist.items.exec((err, pl_items) => {
        debug("err", err);
        if (err) return reject(err);

        const cached_feeds = {};

        const items = [];

        Promise.all(
          pl_items.map(i => {
            const item = i.episode;
            item.order_index = i.order_index;

            if (!item) {
              debug("no valid episode for plitem " + i._id);
              return Promise.resolve();
            }

            if (item.published_at <= new Date()) {
              debug("Ignoring unpublished episode");
              return Promise.resolve();
            }

            if (!cached_feeds[item.feed_id]) {
              debug("no cached feeds promise for feed_id : ", item.feed_id);
              cached_feeds[item.feed_id] = new Promise((resolve, reject) => {
                Feed.findOne({ _id: item.feed_id }).exec((err, feed) => {
                  debug("feed_id find", item.feed_id, { err, feed });

                  if (err) return reject(err);
                  return resolve(feed);
                });
              });
            }

            debug("returning promise");
            return cached_feeds[item.feed_id].then(feed => {
              debug("found feed, pushing item", item.feed_id);
              item.feed = feed;
              items.push(item);
            });
          })
        ).then(() => {
          debug("resolving items", items);
          resolve(items.sort((a, b) => a.order_index - b.order_index));
        });
      });
    });
  }
};

export default Playlist;
