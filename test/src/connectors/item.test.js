import Item from "~/connectors/item"

import chai from "chai"
import chaiAsPromised from "chai-as-promised"

import MongoHelper from "#/helpers/mongodb.helper"

chai.use(chaiAsPromised)
const expect = chai.expect

describe("Item", () => {
  before(done => {
    MongoHelper.setup(done)
  })

  it("should have author", done => {
    Item.find({}).exec(function(err, items) {
      if (err) {
        console.error(err)
        throw err
      } else {
        console.log(items[0])
        expect(items).to.be.an("array").that.is.not.empty
        expect(items[0]).to.be.an("object")
        expect(items[0].author).to.be.a("string").that.is.not.empty
      }
      done()
    })
  })

  after(done => {
    MongoHelper.tearDown(done)
  })
})
