import express from 'express';
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { makeExecutableSchema } from 'graphql-tools';
import Schema from './data/schema';
import bodyParser from 'body-parser';
import Resolvers from './data/resolvers';

const GRAPHQL_PORT = 8880;

var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers
  }),
  debug: true
}));

app.use('/graphiql', graphiqlExpress({
  graphiql: true,
  pretty: true,
  endpointURL: '/graphql'
}));

app.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));
