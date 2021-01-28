import Mongoose from "mongoose";
import CoverSchema from "./cover_schema";

Mongoose.Promise = global.Promise;

const ObjectId = Mongoose.Schema.Types.ObjectId;

const PlaylistItemSchema = new Mongoose.Schema({
  order_index: Number,
  episode_id: { type: ObjectId, ref: "Item", alias: "episode" },
  playlist_id: { type: ObjectId, ref: "Playlist", alias: "playlist" }
});

export const PlaylistItem = Mongoose.model(
  "PlaylistItem",
  PlaylistItemSchema,
  "playlist_items"
);

const PlaylistSchema = new Mongoose.Schema({
  _id: ObjectId,
  name: String,
  description: Boolean,
  color: String,
  etag: String,
  user_id: ObjectId
});

PlaylistSchema.virtual("items").get(function() {
  return PlaylistItem.find({ playlist_id: this._id })
    .sort({ order_index: 1 })
    .populate("episode_id");
});

const UserSchema = new Mongoose.Schema({
  _id: ObjectId,
  favorites: PlaylistSchema,
  morning_playlist: PlaylistSchema,
  journey_playlist: PlaylistSchema,
  work_playlist: PlaylistSchema,
  home_playlist: PlaylistSchema,
  evening_playlist: PlaylistSchema,
  playlists: [PlaylistSchema]
});

export const User = Mongoose.model("User", UserSchema);

export default User;
