import net from "net"
import fs from "fs"
import http from "http"

import express from "express"
import compression from "compression"
import { graphqlExpress, graphiqlExpress } from "apollo-server-express"
import { makeExecutableSchema } from "graphql-tools"
import bodyParser from "body-parser"

import pino from "express-pino-logger"

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

  server.use(pino())

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

  const unix_socket =
    typeof config.socket === "string" && config.socket.trim() !== ""

  const portOrUnix = unix_socket ? config.socket : config.port

  const http_server = http
    .createServer(server)
    .listen(portOrUnix, config.listen)

  if (unix_socket) {
    http_server.on("listening", () => {
      // set permissions
      return fs.chmod(config.socket, 0o777, err => err && console.error(err))
    })

    // double-check EADDRINUSE
    http_server.on("error", e => {
      if (e.code !== "EADDRINUSE") throw e
      net
        .connect({ path: config.socket }, () => {
          // really in use: re-throw
          throw e
        })
        .on("error", e => {
          if (e.code !== "ECONNREFUSED") throw e
          // not in use: delete it and re-listen
          fs.unlinkSync(config.socket)
          server.listen(config.socket, config.listen)
        })
    })
  }

  return server
}

export default GraphQLServer
