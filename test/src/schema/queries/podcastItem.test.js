import proxyquire from "proxyquire"
import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import "sinon-mongoose"

import { Types } from "mongoose"
const ObjectId = Types.ObjectId

import Item from "~/connectors/item"

const expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)

describe("Schema", () => {
  describe("queries", () => {
    describe("podcastItem", () => {
      var podcastItem
      var ItemMock

      beforeEach(function() {
        ItemMock = sinon.mock(Item)

        podcastItem = proxyquire(
          "../../../../src/schema/queries/resolvers/podcastItem",
          {
            Item
          }
        ).default
      })

      beforeEach(function() {
        ItemMock.restore()
      })

      it("should return a promise", () => {
        const query = podcastItem({}, { _id: "" })
        expect(query).to.be.a("promise")
      })

      it("should reject the promise when database has an error", () => {
        const err_msg =
          "Error occured (simulated at " + +new Date() / 1000 + ")"

        ItemMock.expects("findOne")
          .chain("exec")
          .yields(err_msg, null)

        const query = podcastItem({}, { _id: "" })

        expect(query).to.be.a("promise")
        ItemMock.verify()

        return expect(query).to.be.eventually.rejectedWith(err_msg)
      })
    })
  })
})
