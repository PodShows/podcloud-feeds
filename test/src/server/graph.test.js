import { expect } from "chai";

import * as testServer from "#/helpers/server.helper"
import MongoHelper from "#/helpers/mongodb.helper"

describe("GraphQL Server", () => {

	before((done) => {
		testServer.start(() => {
			MongoHelper.setup(done)
		})
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
			it("should not include unpublished items", () => {
				return testServer.graphqlQuery(`
					{
					  podcastForFeedWithIdentifier(identifier: "blog") {
					  	items {
					  		title
					  	}
					  }
					}
				`).then((response) => {
			        expect(response.statusCode).to.equal(200)
			        expect(response.body.data).to.have.property("podcastForFeedWithIdentifier")

			        const feed = response.body.data.podcastForFeedWithIdentifier

			        expect(feed.items)
			        	.to.be.an("array")			        	
			        	.that.is.not.empty
			        	
			        expect(feed.items)
			        	.to.not.deep.include({
			        		title: "Blog post dans le turfu"
			        	})
				})
			})

			it("should respect items order", () => {
				return testServer.graphqlQuery(`
					{
					  podcastForFeedWithIdentifier(identifier: "blog") {
					  	identifier
					  	items {
					  		published_at
					  	}
					  }
					}
				`).then((response) => {
			        expect(response.statusCode).to.equal(200)
			        expect(response.body.data).to.have.property("podcastForFeedWithIdentifier")

			        const feed = response.body.data.podcastForFeedWithIdentifier

			        expect(feed.items)
			        	.to.be.an("array")
			        	.and.have.lengthOf.above(1)

			        const first_post = feed.items[0];
			        const last_post = feed.items[feed.items.length-1];
			        expect(Date.parse(first_post.published_at))
			        	.to.be.above(
			        		Date.parse(last_post.published_at)
			        	)

			        return testServer.graphqlQuery(`
						{
						  podcastForFeedWithIdentifier(identifier: "fiction") {
						  	identifier
						  	items {
						  		published_at
						  	}
						  }
						}
					`)
				}).then((response) => {
			        expect(response.statusCode).to.equal(200)
			        expect(response.body.data).to.have.property("podcastForFeedWithIdentifier")

			        const feed = response.body.data.podcastForFeedWithIdentifier

			        expect(feed.items)
			        	.to.be.an("array")
			        	.and.have.lengthOf.above(1)

			        const first_post = feed.items[0];
			        const last_post = feed.items[feed.items.length-1];
			        expect(Date.parse(first_post.published_at))
			        	.to.be.below(
			        		Date.parse(last_post.published_at)
			        	)
				})
			})
		})
	})

	after((done) => {
		testServer.stop(() => {
			MongoHelper.tearDown(done)
		});
	})

})
