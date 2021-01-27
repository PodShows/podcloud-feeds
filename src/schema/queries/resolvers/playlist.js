import { empty } from "~/utils";
import User from "~/connectors/user";

const debug = require("debug")("podcloud-feeds:queries:playlist");

const playlist = function(obj, args, context, info) {
  debug("called");
  return new Promise((resolve, reject) => {
    const error = err => {
      console.error(err);
      return reject(err);
    };

    debug("inside promise");

    debug({ args });

    User.findOne({
      _id: args.user_id
    }).exec((err, user) => {
      debug("err:", err);
      debug("user:", user);

      if (err) {
        return reject(err);
      }

      const {
        playlists,
        favorites,
        morning_playlist,
        journey_playlist,
        work_playlist,
        home_playlist,
        evening_playlist
      } = user;

      const playlist = [
        favorites,
        morning_playlist,
        journey_playlist,
        work_playlist,
        home_playlist,
        evening_playlist,
        ...playlists
      ].find(pl => {
        debug("pl:", pl);
        return pl && pl._id == args._id;
      });

      debug("playlist:", playlist);
      debug("playlist.items:", playlist.items);
      resolve(playlist);
    });
  });
};

export default playlist;
