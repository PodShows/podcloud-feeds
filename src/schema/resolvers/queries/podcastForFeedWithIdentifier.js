import { notEmpty } from "~/utils";
import Feed from "~/connectors/feed";
import { Cache } from  "node-cache-store";

const debug = require("debug")("podcastForFeedWithIdentifier");

const podcastIdentifiersCache = new Cache({
    expire: 300,
    expiredLoopTerm: 360
})

const PodcastFields =  [
    "_id", "title", "catchline",
    "description", "identifier",
    "language", "contact_email",
    "author", "explicit", "tags",
    "cover_filename", "parent_feed", "external",
    "block_itunes", "itunes_category",
    "disabled", "feed_redirect_url",
    "web_redirect_url", "created_at",
    "ordering", "updated_at", "_slugs"
];

const podcastForFeedWithIdentifier = function(obj, args, context, info) {
    debug("called");
    return new Promise((resolve, reject) => {
        debug("inside promise");
        if(
            typeof args !== "object" || 
            !args.hasOwnProperty("identifier") || 
            typeof args.identifier !== "string"
        ) {
            console.error("args.identifier must be a string!");
            reject("args.identifier must be a string!");
        }
        const identifier_cleaned = args.identifier.toLowerCase().trim();
        const cache_key = "identifier-uid-"+identifier_cleaned;
        debug("Looking for cached uid with key : "+cache_key);
        const found = podcastIdentifiersCache.get(cache_key)

        let findArgs;

        if(notEmpty(found)) {
            debug("Found cached uid : "+found);
            findArgs = [{_id: found}, PodcastFields];
        } else {
            debug("Cached uid not found, executing big ass query");
            findArgs = [
                {
                    draft: {"$ne": true},
                    feed_to_takeover_id: {"$exists": false},
                    external: {"$ne": true},
                    "$or": [
                        { custom_domain: identifier_cleaned },
                        { identifier: identifier_cleaned },
                        { _slugs: identifier_cleaned }
                    ]
                },
                PodcastFields                                
            ];
        }
        
        Feed.findOne(...findArgs).exec(function(err, feed) {
            if(err) {
                console.error(err);
                reject(err);
            } else {
                let keys;
                if(feed === null) {
                    keys = [];
                } else {
                    debug("Found podcast.");
                    keys = [
                        feed.identifier,
                        ...feed._slugs,
                        feed.custom_domain
                    ].filter((item, pos, self) => {
                        return self.indexOf(item) == pos && notEmpty(item);
                    }).map(i => "identifier-uid-"+i);
                }
                if(notEmpty(found) && (keys.indexOf(identifier_cleaned) === -1 || feed === null)) {
                    debug("Found podcast doesn't include cached identifier, we need to invalidate cache");
                    // cached value is not valid anymore
                    podcastIdentifiersCache.delete(cache_key);
                    resolve(null);
                } else {
                    if(feed !== null) {
                        debug("Updating cache with up to date data")
                        const feed_id = feed._id.toString();
                        keys.forEach(k => {
                            debug("Setting cache "+k+"="+feed_id)
                            podcastIdentifiersCache.set(k, feed_id)
                        });
                    }
                    resolve(feed);
                }
            }
        });

    });
};

podcastForFeedWithIdentifier.clearCache = function() {
    podcastIdentifiersCache.clear();
}

export default podcastForFeedWithIdentifier;