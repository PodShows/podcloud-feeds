import { typeDefs, resolvers } from "~/schema"
import mongo_connect from "~/connectors/connection"
import Server from "~/server"
import { empty } from "~/utils"
import config from "config"

import process from "process"

const socket = config.has("socket") ? config.get("socket") : null
const port = empty(socket) && config.has("port") ? config.get("port") : null

const server = new Server({
  typeDefs,
  resolvers,
  port,
  socket,
  context: {
    hosts: config.get("hosts")
  },
  prepare: () =>
    mongo_connect(config.get("mongodb")).catch(() => process.exit(1)),
  listen: () =>
    console.log(
      "GraphQL Server is now running on " +
        (port ? `http://localhost:${port}/graphql` : socket)
    )
})
