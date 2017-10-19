import moment from 'moment';
import { DateFormat } from '~/schema/enums';
import { notEmpty } from "~/utils";

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
    published_at(item, args = { format: "RFC822"}) {
        return moment.utc(item.published_at).format(DateFormat.resolve(args.format));
    },
    url(item) {
        let url = notEmpty(item.link) ? item.link : "http://"+item.feed.identifier+".lepodcast.fr/"+item._slugs[item._slugs.length-1];
        if(!(/^https?:\/\//.test(url))) url = "http://"+url;
        return url;
    }
};

export default Post;