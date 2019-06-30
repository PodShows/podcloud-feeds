import { expect } from "chai"
import sinon from "sinon"

import { buildSchema } from "#/helpers/schema.helper.js"

describe("Schema", () => {
  it("should be a valid GraphQL schema", () => {
    sinon.stub(console, "warn")

    let schema = buildSchema()

    if (console.warn.called) {
      throw new Error(console.warn.getCall(0).args.join(", "))
    }

    console.warn.restore()
    expect(schema).to.be.an("object")
  })
})
