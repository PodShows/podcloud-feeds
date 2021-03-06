import { expect } from "chai";
import Server from "~/server";

// Fixtures
import resolvers from "#/fixtures/graphql/resolvers.fixture";
import typeDefs from "#/fixtures/graphql/typeDefinitions.fixture";

const createServer = function(td, rs) {
  return function() {
    return new Server(td, rs);
  };
};

describe("Server object", () => {
  it("should be an initializer function", () => {
    expect(Server).to.be.a("function");
  });

  it("should require type definitions", () => {
    expect(createServer({ resolvers })).to.throw(
      Error,
      "Must provide typeDefs"
    );
  });

  it("should require resolvers", () => {
    expect(createServer({ typeDefs })).to.throw(
      Error,
      "Must provide resolvers"
    );
  });

  it("should return an express server", () => {
    const server = createServer({ typeDefs, resolvers })();

    expect(server).to.have.ownProperty("listen");
    expect(server.listen).to.be.a("function");
  });
});
