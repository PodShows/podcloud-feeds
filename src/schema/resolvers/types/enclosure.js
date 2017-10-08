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
    url(enclosure) {
        return enclosure.meta_url.path;
    }
};

export default Enclosure;