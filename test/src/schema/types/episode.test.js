import { expect } from "chai";
import sinon from "sinon";

import * as graphql from "graphql";
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js";
import { context } from "#/helpers/server.helper";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

describe("Episode Graph Object", () => {
  const schema = buildSchema();
  const fields = schema.getType("Episode").getFields();

  const obj = {
    _id: ObjectId("a5b7321bf6ab350bcef47624"),
    original_guid: "abc123",
    feed: { identifier: "toto" },
    _slugs: ["test", "abc"],
    enclosure: {
      duration_in_seconds: 600,
      length: "123521",
      mime_type: "audio/mpeg",
      filename: "filename.mp3",
      meta_url: {
        path: "http://anurl.test/afile.mp3"
      }
    }
  };

  before(() => {
    testGraphQLProperty.context = context;
  });

  after(() => {
    testGraphQLProperty.restore();
  });

  it(
    "should include and resolve a required Enclosure",
    testGraphQLProperty(
      fields,
      "enclosure",
      new graphql.GraphQLNonNull(schema.getType("Enclosure")),
      obj,
      obj.enclosure
    )
  );

  it(
    "should resolve guid with _id when use_original_guid is not present",
    testGraphQLProperty(
      fields,
      "guid",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj._id.toString()
    )
  );

  it(
    "should resolve guid with _id when use_original_guid is false",
    testGraphQLProperty(
      fields,
      "guid",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      { ...obj, use_original_guid: false },
      obj._id.toString()
    )
  );

  it(
    "should resolve guid with original_guid when use_original_guid is true",
    testGraphQLProperty(
      fields,
      "guid",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      { ...obj, use_original_guid: true },
      obj.original_guid
    )
  );

  it(
    "should resolve guid with _id when use_original_guid is true but original_guid is empty",
    testGraphQLProperty(
      fields,
      "guid",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      { ...obj, original_guid: "", use_original_guid: true },
      obj._id.toString()
    )
  );
});
