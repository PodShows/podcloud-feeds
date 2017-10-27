import express from "express"
import { graphql } from "graphql"
import request from "request-promise"

import http from 'http'

import Server from '~/server'
import { typeDefs, resolvers } from '~/schema';
import config from 'config';

const server = http.createServer(
  new Server(typeDefs, resolvers, {
    debug: true,
    formatError: (err) => { 
      console.log(err.stack); 
      return err.message;
    }
  })
)

const port = config.get("port");

export function start(done) {
  server.listen(port, done)
};

export function stop(done) {
  server.close()
  done()
};

export function graphqlQuery(query) {
  return request({
    baseUrl : `http://localhost:${server.address().port}`,
    uri : '/graphql',
    qs : { query },
    resolveWithFullResponse: true,
    json: true
  })
};