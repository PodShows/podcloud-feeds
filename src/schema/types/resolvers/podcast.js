import moment from 'moment';
import Item from "~/connectors/item";
import { DateFormat } from '~/schema/enums';
import { notEmpty } from "~/utils";
import path from 'path';

const ItemFields = [
    "_id", "title",
    "content", "published_at",
    "enclosure", "_slugs"
];

const Podcast = {
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
    cover_url(feed) {
        return "http://"+feed.identifier+".lepodcast.fr/cover"+path.extname(feed.cover_filename);
    },
    created_at(feed, args = { format: "RFC822"}) {
        return moment.utc(feed.created_at).format(DateFormat.resolve(args.format));
    },
    updated_at(feed, args = { format: "RFC822"}) {
        return moment.utc(feed.updated_at).format(DateFormat.resolve(args.format));
    },
    internal(feed) {
        return !feed.external;
    },
    external(feed) {
        return feed.external;
    },
    feed_url(feed) {
        let url = feed.external ? feed.parent_feed : feed.identifier+".lepodcast.fr/rss";
        if(!((/^https?:\/\//i).test(url))) url = "http://"+url;

        return url;  
    },
    website_url(feed) {
        let url = notEmpty(feed.link) ? feed.link : feed.identifier+".lepodcast.fr/";
        if(!((/^https?:\/\//i).test(url))) url = "http://"+url;

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
};

export default Podcast;