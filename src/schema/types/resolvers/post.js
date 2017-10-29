import moment from 'moment';
import { DateFormat } from '~/schema/enums';
import { notEmpty } from "~/utils";
import Podcast from "./podcast"

const Post = {
    guid(item) {
        return item._id.toString();
    },
    title(item) {
        return item.title;
    },
    author(item) {
        return notEmpty(item.author) ? item.author : item.feed.author;
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
    published_at(item, args = {}) {
        args.format = args.format || "RFC822"
        return moment.utc(item.published_at).format(DateFormat.resolve(args.format));
    },
    url(item, args, ctx) {
        let url = notEmpty(item.link) ? item.link : "http://"+Podcast._host(item.feed, args, ctx)+"/"+item._slugs[item._slugs.length-1];
        if(!(/^https?:\/\//.test(url))) url = "http://"+url;
        return url;
    }
};

export default Post;