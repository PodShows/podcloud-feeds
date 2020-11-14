import { expect } from "chai"

import rootQuery from "~/schema/queries/resolvers/rootQuery"

describe("Schema", () => {
  describe("queries", () => {
    describe("rootQuery", () => {
      it("should have *podcast* query", () => {
        expect(rootQuery).to.have.ownProperty("podcast")
        expect(rootQuery.podcast).to.be.a("function")
      })

      it("should have *podcastItem* query", () => {
        expect(rootQuery).to.have.ownProperty("podcastItem")
        expect(rootQuery.podcastItem).to.be.a("function")
      })
    })
  })
})
