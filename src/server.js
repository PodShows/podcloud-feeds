import express from 'express';
import compression from 'compression'
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';


function GraphQLServer(typeDefs = null, resolvers = null) {
	this.server = express();

	this.server.use('/graphql', bodyParser.json(), graphqlExpress({
	  schema: makeExecutableSchema({
	    typeDefs: typeDefs,
	    resolvers: resolvers
	  }),
	  debug: true
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