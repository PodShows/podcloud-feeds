import path from "path"

const Enclosure = {
    duration(enclosure) {
        return enclosure.duration_in_seconds;
    },
    size(enclosure) {
        return parseInt(enclosure.length, 10);
    },
    type(enclosure) {
        return enclosure.mime_type;
    },
    url(enclosure, args, ctx) {
        return "http://"+ctx.hosts.stats+"/"+enclosure.item.feed.identifier+"/"+enclosure.item._slugs[enclosure.item._slugs.length-1]+"/enclosure"+path.extname(enclosure.meta_url.path)+"?p=f";
    }
};

export default Enclosure;