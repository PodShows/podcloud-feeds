const PodcastItem = {
    __resolveType(data, context, info){
        if(data.enclosure.meta_url.path){
            return info.schema.getType('Episode');
        }
        
        return info.schema.getType('Post');
    }
};

export default PodcastItem;