import GraphQLDate from 'graphql-date';
import { Feed } from './connectors';

const resolveFunctions = {
  Date: GraphQLDate.constructor,
  RootQuery: {
    feeds(){
        return new Promise((resolve, reject) => {
            Feed.find(
                {
                  draft: {"$ne": true},
                  disabled: {"$ne": true}            
                }, [
                    "title", "catchline",
                    "description", "identifier",
                    "parent_feed", "external",
                    "created_at"
                ], {
                    sort:{
                        created_at: -1
                    },
                    limit: 500
                }
            ).exec(function(err, feeds) {
                if(err) {
                    reject(err);
                } else {
                    resolve(feeds);
                }
            });
        });
    },
  },
  Feed: {
    title(feed){
      return feed.title;
    },
    catchline(feed){
      return feed.catchline;
    },
      created_at(feed) { return new Intl.DateTimeFormat("fr-FR", {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
          
}).format(feed.created_at); },
    internal(feed) { return !feed.external; },
    external(feed) { return feed.external; },
    description(feed) { return feed.description; },
    url(feed){
      let url = feed.external ? feed.parent_feed : feed.identifier+".lepodcast.fr/";
      if(!(/^https?:\/\//.test(url))) url = "http://"+url;

      return url;  
    }
  }
}

export default resolveFunctions;
