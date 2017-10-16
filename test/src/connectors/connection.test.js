import chai from "chai";
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)
const expect = chai.expect

import mongo_connect from "~/connectors/connection.js";
import mongo_connect_test_db from "#/helpers/mongodb.js";

describe("mongo_connect", () => {
	it("should be a function", () => {
		expect(mongo_connect).to.be.a("function")
	})

	it("should reject when server is wrong", () => {
		return expect(
			mongo_connect("mongodb://stupidserver")
		).to.be.eventually.rejectedWith("failed to connect to server")
	})

	it("should resolve when server is good", () => {
		return expect(
			mongo_connect_test_db()
		).to.be.eventually.fulfilled;
	})
})