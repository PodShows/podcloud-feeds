import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema } from "#/helpers/schema.helper"
import { context } from "#/helpers/server.helper"
import BigInt from "graphql-bigint"

describe("Enclosure Graph Object", () => {
  const schema = buildSchema()
  const enclosureFields = schema.getType("Enclosure").getFields()

  const enclosureObject = {
    item: {
      _slugs: ["toto", "tata"],
      feed: { identifier: "blog-de-toto" },
      updated_at: new Date(1337 * 1000)
    },
    duration_in_seconds: 600,
    length: "123521",
    mime_type: "audio/mpeg+test",
    filename: "afile.mp3",
    meta_url: {
      path: "http://anurl.test/afile.mp3?p=f"
    }
  }

  it("should include a required int duration", () => {
    expect(enclosureFields).to.have.property("duration")
    expect(enclosureFields.duration.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLInt)
    )
  })

  it("should resolve duration", () => {
    enclosureObject.duration_in_seconds = 600
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(600)
    enclosureObject.duration_in_seconds = -1
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(0)
    enclosureObject.duration_in_seconds = null
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(0)
    delete enclosureObject.duration_in_seconds
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(0)
  })

  it("should include a required bigint size", () => {
    expect(enclosureFields).to.have.property("size")
    expect(enclosureFields.size.type).to.deep.equals(
      new graphql.GraphQLNonNull(BigInt)
    )
  })

  it("should resolve size", () => {
    expect(enclosureFields.size.resolve(enclosureObject)).to.equals(123521)
    const five_tera = 5 * 1024 * 1024 * 1024 * 1024 * 1024
    expect(
      enclosureFields.size.resolve({
        ...enclosureObject,
        length: "" + five_tera /* 5 To */
      })
    ).to.equals(five_tera)
  })

  it("should include a required string type", () => {
    expect(enclosureFields).to.have.property("type")
    expect(enclosureFields.type.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should resolve mpeg type with mp3 media type", () => {
    expect(
      enclosureFields.type.resolve({
        ...enclosureObject,
        media_type: "mp3"
      })
    ).to.equals("audio/mpeg")
  })

  it("should resolve type", () => {
    expect(enclosureFields.type.resolve(enclosureObject)).to.equals(
      "audio/mpeg+test"
    )
  })

  it("should include a required string url", () => {
    expect(enclosureFields).to.have.property("url")
    expect(enclosureFields.url.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should resolve url", () => {
    expect(enclosureFields.url.resolve(enclosureObject, {}, context)).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure." +
        1337 +
        ".mp3?p=f"
    )
  })
})
