import GraphQLDate from 'graphql-date';
import { Feed, Item } from './connectors';
import moment from 'moment';
import path from 'path';

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

const ItemFields = [
    "_id", "title",
    "content", "published_at",
    "enclosure", "_slugs"
];

const DateFormat = {
    "RFC822": "ddd, DD MMM YYYY HH:mm:ss ZZ"
};

const resolveFunctions = {
    Date: GraphQLDate.constructor,
    RootQuery: {
        podcasts(){
            return new Promise((resolve, reject) => {
                Feed.find(
                    {
                        draft: {"$ne": true},
                        disabled: {"$ne": true}            
                    }, PodcastFields, {
                        sort:{
                            created_at: -1
                        },
                        limit: 500
                    }
                ).exec(function(err, feeds) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(feeds);
                    }
                });
            });
        },
        podcastWithIdentifier(obj, args, context, info) {
            return new Promise((resolve, reject) => {
                Feed.findOne(
                    {
                        draft: {"$ne": true},
                        disabled: {"$ne": true},
                        identifier: args.identifier
                    }, PodcastFields, {
                        sort:{
                            created_at: -1
                        }
                    }
                ).exec(function(err, feed) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(feed);
                    }
                });
            });
        }
    },
    Podcast: {
        title(feed){
            return feed.title;
        },
        identifier(feed){
            return feed.identifier;
        },
        catchline(feed){
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
        cover_url(feed) {
            return "http://"+feed.identifier+".lepodcast.fr/cover"+path.extname(feed.cover_filename);
        },
        created_at(feed, args) {
            return moment(feed.created_at).format(DateFormat[args.format]);
        },
        updated_at(feed, args) {
            return moment(feed.updated_at).format(DateFormat[args.format]);
        },
        internal(feed) {
            return !feed.external;
        },
        external(feed) {
            return feed.external;
        },
        feed_url(feed) {
            let url = feed.external ? feed.parent_feed : feed.identifier+".lepodcast.fr/rss";
            if(!(/^https?:\/\//.test(url))) url = "http://"+url;

            return url;  
        },
        website_url(feed) {
            let url = typeof feed === "string" && feed.link.length > 0 ? feed.link : feed.identifier+".lepodcast.fr/";
            if(!(/^https?:\/\//.test(url))) url = "http://"+url;

            return url;
        },
        explicit(feed) {
            return !!feed.explicit;
        },
        tags(feed) {
            return (feed.tags || "").split(",")
        },
        itunes_block(feed) {
            return feed.block_itunes;
        },
        itunes_category(feed) {
            return feed.itunes_category;
        },
        disabled(feed) {
            return !!feed.disabled;
        },
        feed_redirect_url(feed) {
            let fru = feed.feed_redirect_url;
            if(!(/^https?:\/\//.test(fru))) fru = "http://"+fru;
            return fru;
        },
        web_redirect_url(feed) {
            let wru = feed.web_redirect_url;
            if(!(/^https?:\/\//.test(wru))) wru = "http://"+wru;
            return wru;            
        },
        items(feed) {
            return new Promise((resolve, reject) => {
                Item.find(
                    {
                        feed_id: feed._id,
                        published_at: {
                            "$lte": new Date()
                        }
                    },
                    ItemFields,
                    {
                        sort:{
                            published_at: (feed.ordering == "asc" ? 1 : -1)
                        }
                    }
                ).exec(function(err, items) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(
                            items.map(item => {
                                item.feed = feed;
                                return item;
                            })
                        );
                    }
                });
            });
        }
    },
    PodcastItem: {
        __resolveType(data, context, info){
            if(data.enclosure.meta_url.path){
                return info.schema.getType('Episode');
            }
            
            return info.schema.getType('Post');
        }
    },
    Post: {
        guid(item) {
            return item._id;
        },
        title(item) {
            return item.title;
        },
        author(item) {
            return typeof(item.author) === "string" && item.author.length > 0 ? item.author : item.feed.author;
        },
        explicit(item) {
            return !!item.explicit;
        },
        text_content(item) {
            return item.content;
        },
        formatted_content(item) {
            return item.content;
        },
        published_at(item, args) {
            return moment(item.published_at).format(DateFormat[args.format]);
        },
        url(item) {
            let url = typeof(item.link) === "string" && item.link.length > 0 ? item.link : "http://"+item.feed.identifier+".lepodcast.fr/"+item._slugs[item._slugs.length-1];
            if(!(/^https?:\/\//.test(url))) url = "http://"+url;
            return url;
        }
    },
    Episode: {
        guid(item) {
            return item._id;
        },
        title(item) {
            return item.title;
        },
        text_content(item) {
            return item.content;
        },
        formatted_content(item) {
            return item.content;
        },
        author(item) {
            return typeof(item.author) === "string" && item.author.length > 0 ? item.author : item.feed.author;
        },
        explicit(item) {
            return !!item.explicit;
        },
        published_at(item, args) {
            return moment(item.published_at).format(DateFormat[args.format]);
        },
        url(item) {
            let url = typeof(item.link) === "string" && item.link.length > 0 ? item.link : "http://"+item.feed.identifier+".lepodcast.fr/"+item._slugs[item._slugs.length-1];
            if(!(/^https?:\/\//.test(url))) url = "http://"+url;
            return url;
        },
        cover_url(item) {
            return "http://"+item.feed.identifier+".lepodcast.fr/"+item._slugs[item._slugs.length-1]+"/cover";
        },
        enclosure(item) {
            return item.enclosure;
        }
    },
    Enclosure: {
        duration(enclosure) {
            return enclosure.duration_in_seconds;
        },
        size(enclosure) {
            return parseInt(enclosure.length, 10);
        },
        type(enclosure) {
            return enclosure.mime_type;
        },
        url(enclosure) {
            return enclosure.meta_url.path;
        }
    }
}

export default resolveFunctions;
