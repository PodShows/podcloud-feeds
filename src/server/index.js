import express from "express"
import compression from "compression"
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { makeExecutableSchema } from "graphql-tools"
import bodyParser from "body-parser"

const DEFAULT_CONFIG = {
  typeDefs: null,
  resolvers: null,
  options: {},
  port: 8888,
  socket: null
}

function GraphQLServer(config = DEFAULT_CONFIG) {
  config = { ...DEFAULT_CONFIG, ...config }

  if (typeof config.prepare !== "function") config.prepare = () => {}

  if (typeof config.listen !== "function") config.listen = () => {}

  const graphqlExpressOptions = {
    ...config.options,
    context:
      config.context ||
      (typeof config.options === "object" ? config.options.context : {}),
    schema: makeExecutableSchema({
      typeDefs: config.typeDefs,
      resolvers: config.resolvers
    })
  }

  const server = express()

  server.use(
    "/graphql",
    bodyParser.json({ type: "*/*" }),
    graphqlExpress(graphqlExpressOptions)
  )

  server.use(
    "/graphiql",
    graphiqlExpress({
      graphiql: true,
      pretty: true,
      endpointURL: "/graphql"
    })
  )

  server.use(compression())

  config.prepare()

  let portOrUnix = config.socket
  if (typeof portOrUnix !== "string" || portOrUnix.trim() == "") {
    portOrUnix = config.port
  }

  server.listen(portOrUnix, config.listen)

  return server
}

export default GraphQLServer
