import express from "express";
import { graphql } from "graphql";
import request from "request-promise";

import http from "http";

import Server from "~/server";
import { typeDefs, resolvers } from "~/schema";
import config from "config";

let server;
let port;

export const context = {
  hosts: config.get("hosts")
};

export function start(done) {
  port = config.has("port") ? config.get("port") : 8888;

  server = http.createServer(
    new Server({
      typeDefs,
      resolvers,
      context,
      port,
      options: {
        debug: true,
        formatError: err => {
          console.log(err.stack);
          return err.message;
        }
      },
      listen: done
    })
  );
}

export function stop(done) {
  server.close();
  done();
}

export function graphqlQuery(query) {
  return request({
    baseUrl: `http://localhost:${port}`,
    uri: "/graphql",
    qs: { query },
    resolveWithFullResponse: true,
    json: true
  });
}
