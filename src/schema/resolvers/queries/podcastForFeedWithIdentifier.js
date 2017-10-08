import { notEmpty } from "~/utils";
import Feed from "~/connectors/feed";
import NodeCache from  "node-cache";

const podcastIdentifiersCache = new NodeCache();

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
    return new Promise((resolve, reject) => {
        const identifier_cleaned = args.identifier.toLowerCase().trim();
        const cache_key = "identifier-uid-"+identifier_cleaned;
        console.log("Looking for cached uid with key : "+cache_key);
        podcastIdentifiersCache.get(
            cache_key,
            (err, found) => {
                if(err){
                    console.error(err);
                }
                        
                let findArgs;
                        
                if(notEmpty(found)) {
                    console.log("Found cached uid : "+found);
                    findArgs = [{_id: found}, PodcastFields];
                } else {
                    console.log("Cached uid not found, executing big ass query");
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
                            console.log("Found podcast.");
                            keys = [
                                feed.identifier,
                                ...feed._slugs,
                                feed.custom_domain
                            ].filter((item, pos, self) => {
                                return self.indexOf(item) == pos && notEmpty(item);
                            }).map(i => "identifier-uid-"+i);
                        }
                        if(notEmpty(found) && (keys.indexOf(identifier_cleaned) === -1 || feed === null)) {
                            console.log("Found podcast doesn't include cached identifier, we need to invalidate cache");
                            podcastIdentifiersCache.del(cache_key);
                            // cached value is not valid anymore
                            resolve(null);
                        } else {
                            console.log("Updating cache with up to date data")
                            keys.forEach(k => {
                                console.log("Setting cache "+k+"="+feed._id);
                                podcastIdentifiersCache.set(
                                    k,
                                    feed._id,
                                    function( err, success ) {
                                        if(err){
                                            console.error(err);
                                        }
                                        if(success){
                                            console.log("updated "+k);
                                        }
                                    }
                                );
                            });
                            resolve(feed);
                        }
                    }
                });
            }
        )
    });
};

export default podcastForFeedWithIdentifier;