import { typeDefs, Resolvers } from '~/schema';
import mongo_connect from '~/connectors/connection'
import Server from '~/server'
import config from 'config';

const server = new Server(typeDefs, Resolvers);
const port = config.get("port");

const conn_str = config.get("mongodb")
mongo_connect(conn_str);

server.listen(port, () => console.log(
  `GraphQL Server is now running on http://localhost:${port}/graphql`
));