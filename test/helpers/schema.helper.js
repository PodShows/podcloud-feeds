import { expect } from "chai";
import * as graphql from "graphql";

import { makeExecutableSchema } from "graphql-tools";
import { typeDefs, resolvers } from "~/schema";

export function buildSchema() {
  return makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForNonScalar: true
    }
  });
}

export const testGraphQLProperty = (
  fields,
  property,
  type,
  obj = null,
  expectedResolve = null,
  args = null,
  ctx = null
) => {
  return function() {
    obj = obj || testGraphQLProperty.obj;
    args = args || testGraphQLProperty.args;
    ctx = ctx || testGraphQLProperty.context;

    expect(fields).to.have.property(property);
    expect(fields[property].type).to.deep.equals(type);

    if (!(obj === null && expectedResolve === null)) {
      if (typeof expectedResolve === "boolean") {
        expect(fields[property].resolve(obj, args, ctx)).to.be[
          expectedResolve ? "true" : "false"
        ];
      } else {
        expect(fields[property].resolve(obj, args, ctx)).to.deep.equals(
          expectedResolve
        );
      }
    }
  };
};

testGraphQLProperty.restore = () => {
  testGraphQLProperty.obj = null;
  testGraphQLProperty.args = {};
  testGraphQLProperty.context = {};
};

testGraphQLProperty.restore();
