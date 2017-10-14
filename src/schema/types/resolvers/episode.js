import moment from 'moment';
import { DateFormat } from '~/schema/enums';
import { notEmpty } from "~/utils";

const Episode = {
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
        return notEmpty(item.author) ? item.author : item.feed.author;
    },
    explicit(item) {
        return !!item.explicit;
    },
    published_at(item, args) {
        return moment(item.published_at).format(DateFormat.resolve(args.format));
    },
    url(item) {
        let url = notEmpty(item.link) ? item.link : "http://"+item.feed.identifier+".lepodcast.fr/"+item._slugs[item._slugs.length-1];
        if(!(/^https?:\/\//.test(url))) url = "http://"+url;
        return url;
    },
    cover_url(item) {
        return "http://"+item.feed.identifier+".lepodcast.fr/"+item._slugs[item._slugs.length-1]+"/cover";
    },
    enclosure(item) {
        return item.enclosure;
    }
};

export default Episode;