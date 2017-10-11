import proxyquire from "proxyquire"
import chai from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import "sinon-mongoose";

import Feed from "~/connectors/feed"

const expect = chai.expect;
chai.use(sinonChai)

describe("Resolvers", () => {
	describe("queries", () => {
		describe("podcastForFeedWithIdentifier", () => {
			var podcastForFeedWithIdentifier;
			var FeedMock;

			beforeEach(function () {
				FeedMock = sinon.mock(Feed);

				podcastForFeedWithIdentifier = proxyquire(
					"../../../../../src/schema/resolvers/queries/podcastForFeedWithIdentifier", 
					{ 
						Feed
					}
				).default;
			});

			afterEach(function () {
				FeedMock.restore();
			});

			it("should return a promise", () => {
				const query = podcastForFeedWithIdentifier().then(() => {}, () => {});
				expect(query).to.be.a('promise');
			});

			it("with unknown identifier should resolve null", () => {
				FeedMock
				.expects('findOne')
				.chain('exec')
				.yields(undefined, null);

				const query = podcastForFeedWithIdentifier({}, {identifier: "unknown"})
				expect(query).to.be.a('promise')

				return query.then(() => {
					FeedMock.verify();
					return Promise.resolve();
				}, (err) => {
					return Promise.reject(err);
				});
			});

			it("with known identifier should resolve a feed", () => {
				FeedMock
				.expects('findOne')
				.chain('exec')
				.yields(null, new Feed({identifier: "podcast"}));

				const query = podcastForFeedWithIdentifier({}, {identifier: "podcast"})
				expect(query).to.be.a('promise')

				return query.then(() => {
					FeedMock.verify();
					return Promise.resolve();
				}, (err) => {
					return Promise.reject(err);
				});
			});

			// @todo : fix test
			it.skip("with cached identifier should resolve a feed", () => {
				FeedMock
				.expects('findOne')
				.chain('exec')
				.yields(null, new Feed({_id: "podcast123", identifier: "podcast", _slugs:["podcast", "other-podcast"]}));

				return podcastForFeedWithIdentifier(
					{}, {
						identifier: "podcast"
					}
				).then(() => {
					FeedMock.verify();
					FeedMock.restore();

					FeedMock
					.expects('findOne').withArgs({_id: "podcast123"}, sinon.match.any)
					.chain('exec')
					.yields(null, new Feed({identifier: "podcast", _slugs:["podcast", "other-podcast"]}));

					return podcastForFeedWithIdentifier(
						{}, {
							identifier: "other-podcast"
						}
					).then(() => {
						FeedMock.verify();
	
						return Promise.resolve();
					}, (err) => {
						return Promise.reject(err);
					});
				}, (err) => {
					return Promise.reject(err);
				});
			});
		});
	});
});