import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js"
import { context } from "#/helpers/server.helper"

describe("Episode Graph Object", () => {
  const schema = buildSchema()
  const fields = schema.getType("Episode").getFields()

  const obj = {
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
  }

  before(() => {
    testGraphQLProperty.context = context
  })

  after(() => {
    testGraphQLProperty.restore()
  })

  it(
    "should include and resolve a required Enclosure",
    testGraphQLProperty(
      fields,
      "enclosure",
      new graphql.GraphQLNonNull(schema.getType("Enclosure")),
      obj,
      obj.enclosure
    )
  )
})
