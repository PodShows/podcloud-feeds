import { typeDefs, resolvers } from '~/schema';
import mongo_connect from '~/connectors/connection'
import Server from '~/server'
import config from 'config';

const port = config.get("port") || 8888;

const server = new Server({
	typeDefs, 
	resolvers,
	port,
	context: {
		hosts: config.get("hosts")
	},
	prepare: () => mongo_connect(config.get("mongodb")),
	listen: () => console.log(`GraphQL Server is now running on http://localhost:${port}/graphql`)
});