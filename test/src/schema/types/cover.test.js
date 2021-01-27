import { expect } from "chai";
import sinon from "sinon";

import * as graphql from "graphql";
import { buildSchema } from "#/helpers/schema.helper";
import { context } from "#/helpers/server.helper";
import BigInt from "graphql-bigint";

describe("Cover Graph Object", () => {
  const schema = buildSchema();
  const coverFields = schema.getType("Cover").getFields();

  const coverObject = {
    width: 1400,
    height: 1400,
    sha1: "9fe2ba5283bef78cb925c2c65e985eb3229e22c6",
    squared: true,
    dominant_color: "#c9901f"
  };

  it("should include an int width", () => {
    expect(coverFields).to.have.property("width");
    expect(coverFields.width.type).to.deep.equals(graphql.GraphQLInt);
  });

  it("should include an int height", () => {
    expect(coverFields).to.have.property("height");
    expect(coverFields.height.type).to.deep.equals(graphql.GraphQLInt);
  });

  it("should include an boolean squared", () => {
    expect(coverFields).to.have.property("squared");
    expect(coverFields.squared.type).to.deep.equals(graphql.GraphQLBoolean);
  });

  it("should include a string sha1", () => {
    expect(coverFields).to.have.property("sha1");
    expect(coverFields.sha1.type).to.deep.equals(graphql.GraphQLString);
  });

  it("should include a required string url", () => {
    expect(coverFields).to.have.property("url");
    expect(coverFields.url.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    );
  });

  describe("should resolve url", () => {
    it("when sha1 is present", () => {
      expect(coverFields.url.resolve(coverObject, {}, context)).to.equals(
        "https://" +
          context.hosts.uploads +
          "/uploads/covers" +
          "/9fe2/ba52/83be/f78c/b925/c2c6/5e98/5eb3/229e/22c6" +
          "/9fe2ba5283bef78cb925c2c65e985eb3229e22c6.jpg"
      );
    });

    it("when sha1 is not present", () => {
      expect(
        coverFields.url.resolve(
          { ...coverObject, sha1: undefined },
          {},
          context
        )
      ).to.equals("https://" + context.hosts.uploads + "/images/nocover.jpg");
    });

    it("when sha1 is empty", () => {
      expect(
        coverFields.url.resolve({ ...coverObject, sha1: "" }, {}, context)
      ).to.equals("https://" + context.hosts.uploads + "/images/nocover.jpg");
    });
  });
});
