import { expect } from "chai";
import * as testServer from "#/helpers/server.helper.js"

import loadFixture from 'mongoose-fixture-loader'

import { Feed } from "~/connectors"
import feeds from "#/fixtures/mongodb/feeds.fixture"

describe("GraphQL Server", () => {

	before((done) => {
		testServer.start();
		loadFixture(Feed, feeds)
			.then(() => { done() }, done);
	})
	
	it("should answer requests", () => {
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

		it("should return a podcast using its identifier", () => {
			return testServer.graphqlQuery(`
				{
				  podcastForFeedWithIdentifier(identifier: "blog") {
				  	identifier
				  }
				}
			`).then((response) => {
		        expect(response.statusCode).to.equal(200);
		        expect(response.body.data).to.deep.equal({
					"podcastForFeedWithIdentifier": {
						identifier: "blog"
					}
				})
			})
		})

		it("should return a podcast using its custom_domain", () => {
			return testServer.graphqlQuery(`
				{
				  podcastForFeedWithIdentifier(identifier: "lagreluchedoree.fr") {
				  	identifier
				  }
				}
			`).then((response) => {
		        expect(response.statusCode).to.equal(200);
		        expect(response.body.data).to.deep.equal({
					"podcastForFeedWithIdentifier": {
						identifier: "fiction"
					}
				})
			})
		})

		it("should return a podcast using an older identifier", () => {
			return testServer.graphqlQuery(`
				{
				  podcastForFeedWithIdentifier(identifier: "webiblog") {
				  	identifier
				  }
				}
			`).then((response) => {
		        expect(response.statusCode).to.equal(200);
		        expect(response.body.data).to.deep.equal({
					"podcastForFeedWithIdentifier": {
						identifier: "blog"
					}
				})
			})
		})

		it("should not return drafts", () => {
			return testServer.graphqlQuery(`
				{
				  podcastForFeedWithIdentifier(identifier: "draft") {
				  	identifier
				  }
				}
			`).then((response) => {
		        expect(response.statusCode).to.equal(200);
		        expect(response.body.data).to.deep.equal({
					"podcastForFeedWithIdentifier": null
				})
			})
		});

		it("should not return an ongoing takeover", () => {
			return testServer.graphqlQuery(`
				{
				  podcastForFeedWithIdentifier(identifier: "fiction") {
				  	identifier
				  	catchline
				  }
				}
			`).then((response) => {
		        expect(response.statusCode).to.equal(200);
		        expect(response.body.data).to.deep.equal({
					"podcastForFeedWithIdentifier": {
						identifier: "fiction",
						catchline: "Fictionite" // Not "Takeovering"
					}
				})
			})
		})

		it("should not return an external podcast", () => {
			return testServer.graphqlQuery(`
				{
				  podcastForFeedWithIdentifier(identifier: "france-bleu-auvergne") {
				  	identifier
				  }
				}
			`).then((response) => {
		        expect(response.statusCode).to.equal(200);
		        expect(response.body.data).to.deep.equal({
					"podcastForFeedWithIdentifier": null
				})
			})
		})

		describe("podcast", function() {
			it("should not include unpublished items")
			it("should respect items order")
		})
	})

	after((done) => {
		testServer.stop(() => {
			Feed.remove({}).then(() => { done() }, done);
		});
	})

})
