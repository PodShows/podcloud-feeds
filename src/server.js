import express from 'express';
import compression from 'compression'
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';


function GraphQLServer(typeDefs = null, resolvers = null, graphqlExpressOptions = {}) {
	this.server = express();

	this.server.use('/graphql', bodyParser.json({ type: '*/*' }), graphqlExpress({
		...graphqlExpressOptions,
		schema: makeExecutableSchema({
			typeDefs: typeDefs,
			resolvers: resolvers
		})
	}));

	this.server.use('/graphiql', graphiqlExpress({
	  graphiql: true,
	  pretty: true,
	  endpointURL: '/graphql'
	}));
	
	this.server.use(compression());

	return this.server;
}

export default GraphQLServer;