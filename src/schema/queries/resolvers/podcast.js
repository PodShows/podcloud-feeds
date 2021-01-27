import { empty } from "~/utils";
import Feed from "~/connectors/feed";
import cached from "cached";

const debug = require("debug")("podcloud-feeds:queries:podcast");

const podcastIdentifiersCache = cached("podcastIdentifiersCache", {
  backend: {
    type: "memory"
  },
  defaults: {
    expire: 300
  }
});

const podcast = function(obj, args, context, info) {
  debug("called");
  return new Promise((resolve, reject) => {
    const error = err => {
      console.error(err);
      return reject(err);
    };

    debug("inside promise");

    if (typeof args !== "object") {
      return error("args is not an object");
    }

    const hasIdentifier =
      args.hasOwnProperty("identifier") && !empty(args.identifier);
    const hasId = args.hasOwnProperty("_id") && !empty(args._id);

    const identifier_cleaned = `${args.identifier || ""}`.toLowerCase().trim();
    const cache_key = "identifier-uid-" + identifier_cleaned;

    if (!hasId && !hasIdentifier) {
      return error("Either args.identifier or args._id must be provided");
    }

    if (hasId) {
      debug("Already got _id : " + args._id);
    } else {
      debug("Looking for cached _id with key : " + cache_key);
    }

    const _idPromise = hasId
      ? Promise.resolve(args._id)
      : podcastIdentifiersCache.get(cache_key);

    _idPromise.then(
      id => {
        let findArgs;

        if (!empty(id)) {
          debug("Has _id : " + id);
          findArgs = { _id: id };
        } else {
          debug("No _id, executing big ass query");
          findArgs = {
            draft: { $ne: true },
            $and: [
              {
                $or: [
                  { feed_to_takeover_id: { $exists: false } },
                  { feed_to_takeover_id: null }
                ]
              },
              {
                $or: [
                  { identifier: identifier_cleaned },
                  { _slugs: identifier_cleaned }
                ]
              }
            ]
          };
        }

        const resolveFeed = feed => {
          let keys;
          if (feed === null) {
            keys = [];
          } else {
            debug("Found podcast.", feed);
            keys = [feed.identifier, ...feed._slugs].filter(
              (item, pos, self) => {
                return self.indexOf(item) == pos && !empty(item);
              }
            );
          }

          if (
            !empty(id) &&
            !empty(identifier_cleaned) &&
            (keys.indexOf(identifier_cleaned) === -1 || feed === null)
          ) {
            debug(
              "Found podcast doesn't include cached identifier, we need to invalidate cache"
            );
            debug("identifier_cleaned: " + identifier_cleaned);
            debug("keys: ", keys);

            // cached value is not valid anymore
            podcastIdentifiersCache.unset(cache_key).then(
              () => {
                resolve(null);
              },
              err => {
                throw err;
              }
            );
          } else {
            if (feed !== null) {
              debug("Updating cache with up to date data");
              const feed_id = feed._id.toString();
              const prefix = "identifier-uid-";
              Promise.all(
                keys.map(k => {
                  debug("Setting cache " + k + "=" + feed_id);
                  return podcastIdentifiersCache.set(prefix + k, feed_id);
                })
              ).then(
                () => resolve(feed),
                err => {
                  /* istanbul ignore next */
                  throw err;
                }
              );
            } else {
              resolve(feed);
            }
          }
        };

        const doReq = () =>
          Feed.findOne(findArgs).exec(function(err, feed) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              debug("Got a feed");
              resolveFeed(feed);
            }
          });

        const tryInternalFirst = () =>
          Feed.findOne({ ...findArgs, external: { $ne: true } }).exec(function(
            err,
            feed
          ) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              debug("Tried internal first");
              if (feed === null) {
                debug("Got null");
                debug("Do request now");
                doReq();
              } else {
                debug("Got a feed");
                resolveFeed(feed);
              }
            }
          });

        if (findArgs._id) {
          debug("Do request now");
          doReq();
        } else {
          debug("Try internal first");
          tryInternalFirst();
        }
      },
      err => {
        /* istanbul ignore next */
        throw err;
      }
    );
  });
};

podcast.clearCache = function() {
  cached.dropNamedCache("podcastIdentifiersCache");
};

export default podcast;
