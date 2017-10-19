const PodcastItem = {
    __resolveType(data, context, info){
		const { enclosure: { meta_url: { path: enclosure_path } = {} } = {} } = data

        if(enclosure_path){
            return info.schema.getType('Episode');
        }
        
        return info.schema.getType('Post');
    }
};

export default PodcastItem;