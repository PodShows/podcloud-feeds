import { typeDefs, resolvers } from '~/schema';
import mongo_connect from '~/connectors/connection'
import Server from '~/server'
import { notEmpty } from '~/utils'
import config from 'config';

const port = config.get("port") || null;
const socket = config.get("socket") || null;

if(notEmpty(unixsock))
	port = null;

const server = new Server({
	typeDefs, 
	resolvers,
	port,
	socket,
	context: {
		hosts: config.get("hosts")
	},
	prepare: () => mongo_connect(config.get("mongodb")),
	listen: () => console.log(`GraphQL Server is now running on http://localhost:${port}/graphql`)
});