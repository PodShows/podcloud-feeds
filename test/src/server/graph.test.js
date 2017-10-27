import { expect } from "chai";
import * as testServer from "#/helpers/server.helper.js"

describe("GraphQL Server", () => {

	before(() => {
		testServer.start();
	})
	
	it("should answers requests", () => {
		return testServer.graphqlQuery(`
			{
			  __schema {
			    queryType {
			      kind
			    }
			  }
			}
		`).then((response) => {
	        expect(response.statusCode).to.equal(200);
	        expect(response.body.data).to.deep.equal({
				"__schema": {
					"queryType": {
						"kind": "OBJECT"
					}
				}
			})
		})
	})

	describe("podcastForFeedWithIdentifier query", () => {
		it("should not return an ongoing takeover")

		it("should not return an external podcast")

		it("should return a podcast using its identifier")

		it("should return a podcast using its custom_domain")

		it("should return a podcast using an older identifier")

		it("should not return drafts")

		describe("podcast", function() {
			it("should not include unpublished items")
		})
	})

	after((done) => {
		testServer.stop(done);
	})

})
