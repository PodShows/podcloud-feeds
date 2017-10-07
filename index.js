import { typeDefs, Resolvers } from '~/schema';
import Server from '~/server'
import config from 'config';

const server = new Server(typeDefs, Resolvers);
const port = config.get("port");

server.listen(port, () => console.log(
  `GraphQL Server is now running on http://localhost:${port}/graphql`
));