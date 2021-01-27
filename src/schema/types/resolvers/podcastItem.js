const PodcastItem = {
  __resolveType(data, context, info) {
    const enclosure_path = (((data || {}).enclosure || {}).meta_url || {}).path;

    if (enclosure_path) {
      return info.schema.getType("Episode");
    }

    return info.schema.getType("Post");
  }
};

export default PodcastItem;
