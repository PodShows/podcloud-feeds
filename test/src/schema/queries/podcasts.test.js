import proxyquire from "proxyquire"
import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import "sinon-mongoose"

import { Types } from "mongoose"
const ObjectId = Types.ObjectId

import Feed from "~/connectors/feed"

const expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)

describe("Schema", () => {
  describe("queries", () => {
    describe("podcasts", () => {
      var podcasts
      var FeedMock

      beforeEach(function() {
        FeedMock = sinon.mock(Feed)

        podcasts = proxyquire(
          "../../../../src/schema/queries/resolvers/podcasts",
          {
            Feed
          }
        ).default
      })

      beforeEach(function() {
        FeedMock.restore()
      })

      it("should return a promise", () => {
        const query = podcasts()
        expect(query).to.be.a("promise")
      })

      it("should reject the promise when database has an error", () => {
        const err_msg =
          "Error occured (simulated at " + +new Date() / 1000 + ")"

        FeedMock.expects("find")
          .chain("exec")
          .yields(err_msg, null)

        const query = podcasts()

        expect(query).to.be.a("promise")
        FeedMock.verify()

        return expect(query).to.be.eventually.rejectedWith(err_msg)
      })

      it("should resolve an array", () => {
        FeedMock.expects("find")
          .chain("exec")
          .yields(undefined, [])

        const query = podcasts()

        expect(query).to.be.a("promise")
        FeedMock.verify()

        return expect(query).to.be.eventually.be.an("array")
      })
    })
  })
})
