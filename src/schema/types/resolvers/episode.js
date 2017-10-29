import moment from 'moment';
import Podcast from "./podcast";
import { DateFormat } from '~/schema/enums';
import { notEmpty } from "~/utils";

const Episode = {
    guid(item) {
        return item._id.toString();
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
        return notEmpty(item.author) ? item.author : item.feed.author;
    },
    explicit(item) {
        return !!item.explicit;
    },
    published_at(item, args = {}) {
        args.format = args.format || "RFC822"
        return moment.utc(item.published_at).format(DateFormat.resolve(args.format));
    },
    url(item, args, ctx) {
        let url = notEmpty(item.link) ? item.link : "http://"+Podcast._host(item.feed, args, ctx)+"/"+item._slugs[item._slugs.length-1];
        if(!(/^https?:\/\//.test(url))) url = "http://"+url;
        return url;
    },
    cover_url(item, args, ctx) {
        return "http://"+Podcast._host(item.feed, args, ctx)+"/"+item._slugs[item._slugs.length-1]+"/cover";
    },
    enclosure(item) {
        return item.enclosure;
    }
};

export default Episode;