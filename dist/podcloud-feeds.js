/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dateFormat = __webpack_require__(6);

Object.defineProperty(exports, "DateFormat", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_dateFormat).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitize = exports.markdown = exports.empty = undefined;

var _sanitizeHtml = __webpack_require__(32);

var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

var _marked = __webpack_require__(33);

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const renderer = new _marked2.default.Renderer();
renderer.heading = function (text, level, raw) {
  return "<h" + level + ">" + text + "</h" + level + ">\n";
};

_marked2.default.setOptions({ renderer, breaks: true });

const markdown = function (content, config) {
  content = (0, _marked2.default)(content);

  const allowed_markups = {
    "%SHOWNOTES_ALLOWED_MARKUPS%": `
			a b abbr blockquote br cite code dd del dfn dl dt em kbd li mark ol p pre q s
	        samp small strike strong i ins sub sup time u ul var h1 h2 h3 h4 h5 h6 hr img
		`,
    "%PODCLOUD_ALLOWED_MARKUPS%": `
			a abbr address b bdi bdo blockquote br caption cite code col center colgroup dd
			del dfn div dl dt em figcaption figure form h1 h2 h3 h4 h5 h6 hgroup hr i iframe img input ins
			kbd li mark ol p pre q rp rt ruby s samp small span strike strong sub summary
			sup table tbody td tfoot th thead time tr u ul var wbr
		`
  };

  Object.keys(allowed_markups).forEach(key => {
    content = content.replace(key, allowed_markups[key].match(/\w+/g).map(markup => {
      "<code>" + markup + "</code>";
    }));
  });

  return content;
};

const empty = function (obj) {
  return !(typeof obj === "string" && obj.trim().length > 0);
};

const sanitize = text => empty(text) ? "" : (0, _sanitizeHtml2.default)(text.replace(/<\/(p|div)>/, "</$1><br />").replace(/<br.*\/?>\s*<br.*\/?>/g, "<br />"), {
  allowedTags: [],
  allowedAttributes: {}
}).trim();

exports.empty = empty;
exports.markdown = markdown;
exports.sanitize = sanitize;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enums = __webpack_require__(0);

var _episode = __webpack_require__(7);

var _episode2 = _interopRequireDefault(_episode);

var _post = __webpack_require__(12);

var _post2 = _interopRequireDefault(_post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PodcastItem = `
interface PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  episode_type: String
  season: Int
  episode: Int
  url: String!
  author: String
  explicit: Boolean!
}
`;

exports.default = () => [_enums.DateFormat, PodcastItem, _episode2.default, _post2.default];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = __webpack_require__(5);

var _moment2 = _interopRequireDefault(_moment);

var _item = __webpack_require__(36);

var _item2 = _interopRequireDefault(_item);

var _enums = __webpack_require__(0);

var _utils = __webpack_require__(1);

var _path = __webpack_require__(18);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = __webpack_require__(17)("podcloud-feeds:types:resolvers:podcast");

const ItemFields = ["_id", "title", "content", "author", "updated_at", "published_at", "enclosure", "episode_type", "season", "episode", "cover_choice", "cover_detected", "cover_custom", "_slugs"];

const platform_subdomains = ["faq", "blog", "devblog", "astuces", "changelog"];

const Podcast = {
  _id(feed) {
    return feed._id.toString();
  },
  title(feed) {
    return feed.title;
  },
  identifier(feed) {
    return feed.identifier;
  },
  catchline(feed) {
    return feed.catchline;
  },
  description(feed) {
    return feed.description;
  },
  copyright(feed) {
    return feed.copyright;
  },
  language(feed) {
    return feed.language;
  },
  contact_email(feed) {
    return feed.contact_email;
  },
  author(feed) {
    return feed.author;
  },
  created_at(feed, args = {}) {
    args.format = args.format || "RFC822";
    return _moment2.default.utc(feed.created_at).format(_enums.DateFormat.resolve(args.format));
  },
  updated_at(feed, args = {}) {
    args.format = args.format || "RFC822";
    return _moment2.default.utc(feed.updated_at).format(_enums.DateFormat.resolve(args.format));
  },
  internal(feed) {
    return !feed.external;
  },
  external(feed) {
    return feed.external;
  },
  cover(feed, args, ctx) {
    feed.feed_cover.feed = feed;
    return feed.feed_cover;
  },
  feed_url(feed, args, ctx) {
    let url = feed.external ? feed.parent_feed : `${Podcast._host(feed, args, ctx)}/rss`;

    if (!/^https?:\/\//i.test(url)) url = "http://" + url;

    return url;
  },
  website_url(feed, args, ctx) {
    let url = !(0, _utils.empty)(feed.link) ? feed.link : `${Podcast._host(feed, args, ctx)}/`;

    if (!/^https?:\/\//i.test(url)) url = "http://" + url;

    return url;
  },
  explicit(feed) {
    return !!feed.explicit;
  },
  tags(feed) {
    return (feed.tags || "").split(",");
  },
  googleplay_block(feed) {
    return !!feed.block_google_podcasts;
  },
  itunes_block(feed) {
    return !!feed.block_itunes;
  },
  itunes_category(feed) {
    return feed.itunes_category;
  },
  disabled(feed) {
    return !!feed.disabled;
  },
  feed_redirect_url(feed) {
    if ((0, _utils.empty)(feed.feed_redirect_url)) {
      return null;
    }
    let fru = feed.feed_redirect_url;

    if (!/^https?:\/\//i.test(fru)) fru = "http://" + fru;
    return fru;
  },
  web_redirect_url(feed) {
    if ((0, _utils.empty)(feed.web_redirect_url)) {
      return null;
    }
    let wru = feed.web_redirect_url;

    if (!/^https?:\/\//i.test(wru)) wru = "http://" + wru;
    return wru;
  },
  ordering(feed) {
    return feed.ordering == "asc" ? "asc" : "desc";
  },
  items(feed) {
    return new Promise((resolve, reject) => {
      const findArgs = {
        feed_id: feed._id,
        published_at: {
          $lte: new Date()
        },
        status: "published",
        private: {
          $ne: true
        }
      };

      debug("findArgs", findArgs);

      _item2.default.find(findArgs, ItemFields, {
        sort: {
          published_at: feed.ordering == "asc" ? 1 : -1
        }
      }).exec(function (err, items) {
        debug("err:", err);
        debug("items:", items);
        if (err) {
          reject(err);
        } else {
          resolve(items.filter(i => !!i && typeof i === "object" && !Array.isArray(i)).map(item => {
            item.feed = feed;
            return item;
          }));
        }
      });
    });
  },
  _host(feed, args, ctx) {
    if (!(0, _utils.empty)(feed.custom_domain)) return feed.custom_domain;

    let host = ctx.hosts.podcasts;

    if (platform_subdomains.includes(feed.identifier)) host = ctx.hosts.platform;

    return `https://${feed.identifier}.${host}`;
  }
};

exports.default = Podcast;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const DateFormat = () => [`
	enum DateFormat {
	  RFC822
	}
`];

const DateFormatEnum = {
  RFC822: "ddd, DD MMM YYYY HH:mm:ss ZZ"
};

DateFormat.resolve = key => {
  return DateFormatEnum[key];
};

exports.default = DateFormat;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _podcastItem = __webpack_require__(2);

var _podcastItem2 = _interopRequireDefault(_podcastItem);

var _enums = __webpack_require__(0);

var _enclosure = __webpack_require__(8);

var _enclosure2 = _interopRequireDefault(_enclosure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Episode = `
type Episode implements PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  episode_type: String
  season: Int
  episode: Int
  url: String!
  explicit: Boolean!
  author: String
  enclosure: Enclosure!
}
`;

exports.default = () => [_podcastItem2.default, _enums.DateFormat, _enclosure2.default, Episode];

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scalars = __webpack_require__(27);

var _cover = __webpack_require__(11);

var _cover2 = _interopRequireDefault(_cover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Enclosure = `
type Enclosure {
  duration: Int!
  size: BigInt!
  type: String!
  url: String!
  cover: Cover!
}
`;

exports.default = () => [Enclosure, _scalars.BigInt.schema, _cover2.default];

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlBigint = __webpack_require__(28);

var GraphQLBigInt = _interopRequireWildcard(_graphqlBigint);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const BigInt = {
  schema: `scalar BigInt`,
  resolve: GraphQLBigInt.default
};

exports.default = BigInt;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BigInt = undefined;

var _bigInt = __webpack_require__(9);

var _bigInt2 = _interopRequireDefault(_bigInt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BigInt = exports.BigInt = _bigInt2.default.resolve;

exports.default = {
  BigInt
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const Cover = `
type Cover {
  width: Int!
  height: Int!
  sha1: String!
  squared: Boolean!
  dominant_color: String!
  url: String!
}
`;

exports.default = () => [Cover];

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _podcastItem = __webpack_require__(2);

var _podcastItem2 = _interopRequireDefault(_podcastItem);

var _enums = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Post = `
type Post implements PodcastItem {
  guid: String!
  title: String!
  text_content: String!
  formatted_content: String!
  published_at(format: DateFormat = RFC822): String!
  episode_type: String
  season: Int
  episode: Int
  url: String!
  author: String
  explicit: Boolean!
}
`;

exports.default = () => [_podcastItem2.default, _enums.DateFormat, Post];

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feed = __webpack_require__(14);

var _feed2 = _interopRequireDefault(_feed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PodcastFields = ["_id", "title", "catchline", "description", "identifier", "language", "contact_email", "author", "explicit", "tags", "cover_filename", "parent_feed", "external", "block_itunes", "block_google_podcasts", "itunes_category", "disabled", "feed_redirect_url", "web_redirect_url", "created_at", "ordering", "updated_at", "feed_cover", "_slugs"];

const podcasts = function () {
  return new Promise((resolve, reject) => {
    _feed2.default.find({
      draft: { $ne: true },
      disabled: { $ne: true }
    }, PodcastFields, {
      sort: {
        created_at: -1
      },
      limit: 500
    }).exec(function (err, feeds) {
      if (err) {
        reject(err);
      } else {
        resolve(feeds);
      }
    });
  });
};

exports.default = podcasts;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cover_schema = __webpack_require__(15);

var _cover_schema2 = _interopRequireDefault(_cover_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

const ObjectId = _mongoose2.default.Schema.Types.ObjectId;

const FeedSchema = new _mongoose2.default.Schema({
  title: String,
  catchline: String,
  description: String,
  copyright: String,
  feed_cover: _cover_schema2.default,
  identifier: String,
  custom_domain: String,
  feed_to_takeover_id: ObjectId,
  language: String,
  contact_email: String,
  author: String,
  explicit: Boolean,
  draft: Boolean,
  tags: String,
  _slugs: [String],
  parent_feed: String,
  external: Boolean,
  created_at: Date,
  updated_at: Date,
  ordering: String,
  block_itunes: Boolean,
  itunes_category: String,
  disabled: Boolean,
  feed_redirect_url: String,
  web_redirect_url: String
});

const Feed = _mongoose2.default.model("feeds", FeedSchema);

exports.default = Feed;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

const CoverSchema = new _mongoose2.default.Schema({
  filename: String,
  sha1: String,
  width: Number,
  height: Number,
  squared: Boolean,
  dominant_color: String
});

exports.default = CoverSchema;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(1);

var _feed = __webpack_require__(14);

var _feed2 = _interopRequireDefault(_feed);

var _cached = __webpack_require__(34);

var _cached2 = _interopRequireDefault(_cached);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = __webpack_require__(17)("podcloud-feeds:queries:podcastForFeedWithIdentifier");

const podcastIdentifiersCache = (0, _cached2.default)("podcastIdentifiersCache", {
  backend: {
    type: "memory"
  },
  defaults: {
    expire: 300
  }
});

const PodcastFields = ["_id", "title", "catchline", "description", "identifier", "language", "copyright", "contact_email", "author", "explicit", "tags", "cover_filename", "parent_feed", "external", "block_itunes", "block_google_podcasts", "itunes_category", "disabled", "feed_redirect_url", "web_redirect_url", "created_at", "ordering", "updated_at", "feed_cover", "_slugs"];

const podcastForFeedWithIdentifier = function (obj, args, context, info) {
  debug("called");
  return new Promise((resolve, reject) => {
    debug("inside promise");
    if (typeof args !== "object" || !args.hasOwnProperty("identifier") || (0, _utils.empty)(args.identifier)) {
      console.error("args.identifier must be a non-empty string!");
      reject("args.identifier must be a non-empty string!");
    }
    const identifier_cleaned = args.identifier.toLowerCase().trim();
    const cache_key = "identifier-uid-" + identifier_cleaned;
    debug("Looking for cached uid with key : " + cache_key);
    podcastIdentifiersCache.get(cache_key).then(found => {
      let findArgs;

      if (!(0, _utils.empty)(found)) {
        debug("Found cached uid : " + found);
        findArgs = [{ _id: found }, PodcastFields];
      } else {
        debug("Cached uid not found, executing big ass query");
        findArgs = [{
          draft: { $ne: true },
          external: { $ne: true },
          $and: [{
            $or: [{ feed_to_takeover_id: { $exists: false } }, { feed_to_takeover_id: null }]
          }, {
            $or: [{ custom_domain: identifier_cleaned }, { identifier: identifier_cleaned }, { _slugs: identifier_cleaned }]
          }]
        }, PodcastFields];
      }

      _feed2.default.findOne(...findArgs).exec(function (err, feed) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          let keys;
          if (feed === null) {
            keys = [];
          } else {
            debug("Found podcast.", feed);
            keys = [feed.identifier, ...feed._slugs, feed.custom_domain].filter((item, pos, self) => {
              return self.indexOf(item) == pos && !(0, _utils.empty)(item);
            });
          }
          if (!(0, _utils.empty)(found) && (keys.indexOf(identifier_cleaned) === -1 || feed === null)) {
            debug("Found podcast doesn't include cached identifier, we need to invalidate cache");
            debug("identifier_cleaned: " + identifier_cleaned);
            debug("keys: ", keys);
            // cached value is not valid anymore
            podcastIdentifiersCache.unset(cache_key).then(() => {
              resolve(null);
            }, err => {
              throw err;
            });
          } else {
            if (feed !== null) {
              debug("Updating cache with up to date data");
              const feed_id = feed._id.toString();
              const prefix = "identifier-uid-";
              Promise.all(keys.map(k => {
                debug("Setting cache " + k + "=" + feed_id);
                return podcastIdentifiersCache.set(prefix + k, feed_id);
              })).then(() => resolve(feed), err => {
                /* istanbul ignore next */
                throw err;
              });
            } else {
              resolve(feed);
            }
          }
        }
      });
    }, err => {
      /* istanbul ignore next */
      throw err;
    });
  });
};

podcastForFeedWithIdentifier.clearCache = function () {
  _cached2.default.dropNamedCache("podcastIdentifiersCache");
};

exports.default = podcastForFeedWithIdentifier;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _schema = __webpack_require__(21);

var _connection = __webpack_require__(42);

var _connection2 = _interopRequireDefault(_connection);

var _server = __webpack_require__(43);

var _server2 = _interopRequireDefault(_server);

var _utils = __webpack_require__(1);

var _config = __webpack_require__(53);

var _config2 = _interopRequireDefault(_config);

var _process = __webpack_require__(54);

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const socket = _config2.default.has("socket") ? _config2.default.get("socket") : null;
const port = (0, _utils.empty)(socket) && _config2.default.has("port") ? _config2.default.get("port") : null;

const server = new _server2.default({
  typeDefs: _schema.typeDefs,
  resolvers: _schema.resolvers,
  port,
  socket,
  context: {
    hosts: _config2.default.get("hosts")
  },
  prepare: () => (0, _connection2.default)(_config2.default.get("mongodb")).catch(() => _process2.default.exit(1)),
  listen: () => console.log("GraphQL Server is now running on " + (port ? `http://[::]:${port}/graphql` : socket))
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvers = exports.typeDefs = undefined;

var _typeDefs = __webpack_require__(22);

Object.defineProperty(exports, "typeDefs", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_typeDefs).default;
  }
});

var _resolvers = __webpack_require__(29);

var resolvers = _interopRequireWildcard(_resolvers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.resolvers = resolvers;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefinitions = undefined;

var _typeDefs = __webpack_require__(23);

const typeDefinitions = [_typeDefs.RootQuery, `
schema {
  query: RootQuery
}
`];

exports.typeDefinitions = typeDefinitions;
exports.default = typeDefinitions;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RootQuery = undefined;

var _rootQuery = __webpack_require__(24);

var _rootQuery2 = _interopRequireDefault(_rootQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.RootQuery = _rootQuery2.default;

exports.default = () => _rootQuery2.default;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeDefs = __webpack_require__(25);

const RootQuery = `
type RootQuery {
  podcasts: [Podcast]
  podcastForFeedWithIdentifier(identifier: String!): Podcast
}
`;

exports.default = () => [_typeDefs.Podcast, RootQuery];

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cover = exports.Enclosure = exports.Episode = exports.Post = exports.PodcastItem = exports.Podcast = exports.DateFormat = undefined;

var _dateFormat = __webpack_require__(6);

var _podcast = __webpack_require__(26);

var _podcast2 = _interopRequireDefault(_podcast);

var _podcastItem = __webpack_require__(2);

var _podcastItem2 = _interopRequireDefault(_podcastItem);

var _post = __webpack_require__(12);

var _post2 = _interopRequireDefault(_post);

var _episode = __webpack_require__(7);

var _episode2 = _interopRequireDefault(_episode);

var _enclosure = __webpack_require__(8);

var _enclosure2 = _interopRequireDefault(_enclosure);

var _cover = __webpack_require__(11);

var _cover2 = _interopRequireDefault(_cover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.DateFormat = _dateFormat.DateFormat;
exports.Podcast = _podcast2.default;
exports.PodcastItem = _podcastItem2.default;
exports.Post = _post2.default;
exports.Episode = _episode2.default;
exports.Enclosure = _enclosure2.default;
exports.Cover = _cover2.default;

exports.default = () => [_dateFormat.DateFormat, _podcast2.default, _podcastItem2.default, _post2.default, _episode2.default, _enclosure2.default, _cover2.default];

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _enums = __webpack_require__(0);

var _podcastItem = __webpack_require__(2);

var _podcastItem2 = _interopRequireDefault(_podcastItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Podcast = `type Podcast {
  _id: String!
  title: String!
  identifier: String!
  catchline: String!
  copyright: String
  description: String!
  language: String!
  contact_email: String
  author: String
  cover: Cover!
  created_at(format: DateFormat = RFC822): String!
  updated_at(format: DateFormat = RFC822): String!
  internal: Boolean!
  external: Boolean!
  feed_url: String!
  website_url: String!
  explicit: Boolean!
  tags: [String!]
  googleplay_block: Boolean!
  itunes_block: Boolean!
  itunes_category: String
  disabled: Boolean!
  feed_redirect_url: String
  web_redirect_url: String
  items: [PodcastItem]!
  ordering: String!
  _host: String!
}
`;

exports.default = () => [_enums.DateFormat, _podcastItem2.default, Podcast, _podcastItem2.default];

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bigInt = __webpack_require__(9);

Object.defineProperty(exports, "BigInt", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_bigInt).default;
  }
});

var _resolvers = __webpack_require__(10);

Object.defineProperty(exports, "resolvers", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_resolvers).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("graphql-bigint");

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _resolvers = __webpack_require__(30);

Object.defineProperty(exports, "RootQuery", {
  enumerable: true,
  get: function () {
    return _resolvers.RootQuery;
  }
});

var _resolvers2 = __webpack_require__(35);

Object.defineProperty(exports, "Enclosure", {
  enumerable: true,
  get: function () {
    return _resolvers2.Enclosure;
  }
});
Object.defineProperty(exports, "Episode", {
  enumerable: true,
  get: function () {
    return _resolvers2.Episode;
  }
});
Object.defineProperty(exports, "Podcast", {
  enumerable: true,
  get: function () {
    return _resolvers2.Podcast;
  }
});
Object.defineProperty(exports, "PodcastItem", {
  enumerable: true,
  get: function () {
    return _resolvers2.PodcastItem;
  }
});
Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function () {
    return _resolvers2.Post;
  }
});
Object.defineProperty(exports, "Cover", {
  enumerable: true,
  get: function () {
    return _resolvers2.Cover;
  }
});

var _resolvers3 = __webpack_require__(10);

Object.defineProperty(exports, "BigInt", {
  enumerable: true,
  get: function () {
    return _resolvers3.BigInt;
  }
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rootQuery = __webpack_require__(31);

Object.defineProperty(exports, "RootQuery", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_rootQuery).default;
  }
});

var _podcastForFeedWithIdentifier = __webpack_require__(16);

Object.defineProperty(exports, "podcastsForFeedWithIdentifier", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_podcastForFeedWithIdentifier).default;
  }
});

var _podcasts = __webpack_require__(13);

Object.defineProperty(exports, "podcasts", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_podcasts).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _podcasts = __webpack_require__(13);

var _podcasts2 = _interopRequireDefault(_podcasts);

var _podcastForFeedWithIdentifier = __webpack_require__(16);

var _podcastForFeedWithIdentifier2 = _interopRequireDefault(_podcastForFeedWithIdentifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RootQuery = {
  podcasts: _podcasts2.default,
  podcastForFeedWithIdentifier: _podcastForFeedWithIdentifier2.default
};

exports.default = RootQuery;

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("sanitize-html");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("marked");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("cached");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _podcast = __webpack_require__(4);

Object.defineProperty(exports, "Podcast", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_podcast).default;
  }
});

var _podcastItem = __webpack_require__(37);

Object.defineProperty(exports, "PodcastItem", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_podcastItem).default;
  }
});

var _post = __webpack_require__(38);

Object.defineProperty(exports, "Post", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_post).default;
  }
});

var _episode = __webpack_require__(39);

Object.defineProperty(exports, "Episode", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_episode).default;
  }
});

var _enclosure = __webpack_require__(40);

Object.defineProperty(exports, "Enclosure", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_enclosure).default;
  }
});

var _cover = __webpack_require__(41);

Object.defineProperty(exports, "Cover", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_cover).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cover_schema = __webpack_require__(15);

var _cover_schema2 = _interopRequireDefault(_cover_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

const ObjectId = _mongoose2.default.Schema.Types.ObjectId;

const EnclosureUrlSchema = new _mongoose2.default.Schema({
  path: String
});

const EnclosureSchema = new _mongoose2.default.Schema({
  duration_in_seconds: Number,
  length: String,
  mime_type: String,
  meta_url: EnclosureUrlSchema,
  filename: String,
  cover_detected: _cover_schema2.default,
  cover_custom: _cover_schema2.default,
  cover_choice: String
});

const ItemSchema = new _mongoose2.default.Schema({
  feed_id: ObjectId,
  title: String,
  explicit: Boolean,
  author: String,
  link: String,
  status: String,
  _slugs: [String],
  content: String,
  published_at: Date,
  updated_at: Date,
  private: Boolean,
  episode_type: String,
  season: Number,
  episode: Number,
  inferred_type_season_and_episode: Boolean,
  enclosure: EnclosureSchema
});

const Item = _mongoose2.default.model("items", ItemSchema);

exports.default = Item;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const PodcastItem = {
  __resolveType(data, context, info) {
    const enclosure_path = (((data || {}).enclosure || {}).meta_url || {}).path;

    if (enclosure_path) {
      return info.schema.getType("Episode");
    }

    return info.schema.getType("Post");
  }
};

exports.default = PodcastItem;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = __webpack_require__(5);

var _moment2 = _interopRequireDefault(_moment);

var _enums = __webpack_require__(0);

var _utils = __webpack_require__(1);

var _podcast = __webpack_require__(4);

var _podcast2 = _interopRequireDefault(_podcast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Post = {
  guid(item) {
    return item._id.toString();
  },
  title(item) {
    return item.title;
  },
  author(item) {
    return !(0, _utils.empty)(item.author) ? item.author : item.feed.author;
  },
  explicit(item) {
    return !!item.explicit;
  },
  text_content(item) {
    return (0, _utils.sanitize)(item.content);
  },
  formatted_content(item) {
    return (0, _utils.markdown)(item.content);
  },
  published_at(item, args = {}) {
    args.format = args.format || "RFC822";
    return _moment2.default.utc(item.published_at).format(_enums.DateFormat.resolve(args.format));
  },
  episode_type(item) {
    return (/^(full|bonus|trailer)$/.test(item.episode_type) ? item.episode_type : null
    );
  },
  season(item) {
    return +item.season > 0 ? item.season : null;
  },
  episode(item) {
    return +item.episode > 0 ? item.episode : null;
  },
  url(item, args, ctx) {
    let url = !(0, _utils.empty)(item.link) ? item.link : _podcast2.default._host(item.feed, args, ctx) + "/" + item._slugs[item._slugs.length - 1];

    if (!/^https?:\/\//.test(url)) url = "http://" + url;

    return url;
  }
};

exports.default = Post;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = __webpack_require__(5);

var _moment2 = _interopRequireDefault(_moment);

var _podcast = __webpack_require__(4);

var _podcast2 = _interopRequireDefault(_podcast);

var _enums = __webpack_require__(0);

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Episode = {
  guid(item) {
    return item._id.toString();
  },
  title(item) {
    return item.title;
  },
  text_content(item) {
    return (0, _utils.sanitize)(item.content);
  },
  formatted_content(item) {
    return (0, _utils.markdown)(item.content);
  },
  author(item) {
    return !(0, _utils.empty)(item.author) ? item.author : item.feed.author;
  },
  explicit(item) {
    return !!item.explicit;
  },
  published_at(item, args = {}) {
    args.format = args.format || "RFC822";
    return _moment2.default.utc(item.published_at).format(_enums.DateFormat.resolve(args.format));
  },
  url(item, args, ctx) {
    let url = !(0, _utils.empty)(item.link) ? item.link : _podcast2.default._host(item.feed, args, ctx) + "/" + item._slugs[item._slugs.length - 1];

    if (!/^https?:\/\//.test(url)) url = "http://" + url;

    return url;
  },
  episode_type(item) {
    return (/^(full|bonus|trailer)$/.test(item.episode_type) ? item.episode_type : null
    );
  },
  season(item) {
    return +item.season > 0 ? item.season : null;
  },
  episode(item) {
    return +item.episode > 0 ? item.episode : null;
  },
  enclosure(item) {
    item.enclosure.item = item;
    return item.enclosure;
  }
};

exports.default = Episode;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(18);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Enclosure = {
  duration(enclosure) {
    return Math.max(+enclosure.duration_in_seconds, 0) || 0;
  },
  size(enclosure) {
    return parseInt(enclosure.length, 10);
  },
  type(enclosure) {
    return enclosure.mime_type;
  },
  url(enclosure, args, ctx) {
    return "https://" + ctx.hosts.stats + "/" + enclosure.item.feed.identifier + "/" + enclosure.item._slugs[enclosure.item._slugs.length - 1] + "/enclosure." + +(enclosure.item.updated_at / 1000) + _path2.default.extname(`${enclosure.filename}`).replace(/(.*)\?.*$/, "$1") + "?p=f";
  },
  cover(enclosure) {
    let cover = null;

    switch (enclosure.cover_choice) {
      case "detected":
        cover = enclosure.cover_detected;
        break;
      case "custom":
        cover = enclosure.cover_custom;
        break;
      default:
        cover = enclosure.item.feed.feed_cover;
    }

    cover.feed = enclosure.item.feed;
    cover.item = enclosure.item;

    return cover;
  }
};

exports.default = Enclosure;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _podcast = __webpack_require__(4);

var _podcast2 = _interopRequireDefault(_podcast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Cover = {
  url(cover, args, ctx) {
    let url = `${_podcast2.default._host(cover.feed, args, ctx)}`;

    if (cover.item) {
      url += "/" + cover.item._slugs[cover.item._slugs.length - 1];
    }

    url += `/cover.${cover.sha1}.jpg`;

    if (!/^https?:\/\//i.test(url)) url = "http://" + url;

    return url;
  }
};

exports.default = Cover;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = __webpack_require__(3);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

const connect_opts = {
  useMongoClient: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  bufferMaxEntries: 0
};

const connect = (conn_str, opts) => {
  opts.tried++;

  return new Promise((resolve, reject) => {
    _mongoose2.default.connect(conn_str, connect_opts).then(resolve, err => {
      console.error(`Failed to connect to MongoDB (${opts.tried}/${opts.retries})`, err);

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

exports.default = mongo_connect;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _net = __webpack_require__(44);

var _net2 = _interopRequireDefault(_net);

var _fs = __webpack_require__(45);

var _fs2 = _interopRequireDefault(_fs);

var _http = __webpack_require__(46);

var _http2 = _interopRequireDefault(_http);

var _express = __webpack_require__(47);

var _express2 = _interopRequireDefault(_express);

var _compression = __webpack_require__(48);

var _compression2 = _interopRequireDefault(_compression);

var _apolloServerExpress = __webpack_require__(49);

var _graphqlTools = __webpack_require__(50);

var _bodyParser = __webpack_require__(51);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressPinoLogger = __webpack_require__(52);

var _expressPinoLogger2 = _interopRequireDefault(_expressPinoLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_CONFIG = {
  typeDefs: null,
  resolvers: null,
  options: {},
  port: 8888,
  socket: null
};

function GraphQLServer(config = DEFAULT_CONFIG) {
  config = _extends({}, DEFAULT_CONFIG, config);

  if (typeof config.prepare !== "function") config.prepare = () => {};

  if (typeof config.listen !== "function") config.listen = () => {};

  const graphqlExpressOptions = _extends({}, config.options, {
    context: config.context || (typeof config.options === "object" ? config.options.context : {}),
    schema: (0, _graphqlTools.makeExecutableSchema)({
      typeDefs: config.typeDefs,
      resolvers: config.resolvers,
      resolverValidationOptions: {
        requireResolversForNonScalar: true
      }
    })
  });

  const server = (0, _express2.default)();

  server.use((0, _expressPinoLogger2.default)());

  server.use("/graphql", _bodyParser2.default.json({ type: "*/*" }), (0, _apolloServerExpress.graphqlExpress)(graphqlExpressOptions));

  server.use("/graphiql", (0, _apolloServerExpress.graphiqlExpress)({
    graphiql: true,
    pretty: true,
    endpointURL: "/graphql"
  }));

  server.use((0, _compression2.default)());

  config.prepare();

  const unix_socket = typeof config.socket === "string" && config.socket.trim() !== "";

  const srvCfg = unix_socket ? { path: config.socket } : { host: "::", port: config.port };

  const http_server = _http2.default.createServer(server).listen(srvCfg, config.listen);

  if (unix_socket) {
    http_server.on("listening", () => {
      // set permissions
      return _fs2.default.chmod(config.socket, 0o777, err => err && console.error(err));
    });

    // double-check EADDRINUSE
    http_server.on("error", e => {
      if (e.code !== "EADDRINUSE") throw e;
      _net2.default.connect({ path: config.socket }, () => {
        // really in use: re-throw
        throw e;
      }).on("error", e => {
        if (e.code !== "ECONNREFUSED") throw e;
        // not in use: delete it and re-listen
        _fs2.default.unlinkSync(config.socket);
        server.listen(config.socket, config.listen);
      });
    });
  }

  return server;
}

exports.default = GraphQLServer;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("graphql-tools");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("express-pino-logger");

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = require("config");

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("process");

/***/ })
/******/ ]);