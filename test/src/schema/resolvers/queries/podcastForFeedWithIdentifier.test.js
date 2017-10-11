import proxyquire from "proxyquire"
import chai from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import "sinon-mongoose";

import { Types } from "mongoose"
const ObjectId = Types.ObjectId;

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

				podcastForFeedWithIdentifier.clearCache();
			});

			afterEach(function () {
				FeedMock.restore();
			});

			it("should return a promise", () => {
				const query = podcastForFeedWithIdentifier({}, {identifier: ""}).then(() => {}, () => {});
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

			it("should cache identifiers and use this cache to resolve a feed", () => {
				const feed_id = ObjectId("4eb6e7e7e9b7f4194e000001")
				const feed_identifier = "podcast"
				const feed_alias = "other-podcast"
				const feed_obj = new Feed({
					_id: feed_id,
					identifier: feed_identifier, 
					_slugs:[feed_identifier, feed_alias]
				})

				FeedMock
				.expects('findOne')
				.withArgs({
				  $or: [{ custom_domain: feed_identifier }, { identifier: feed_identifier }, { _slugs: feed_identifier }],
				  draft: { $ne: true },
				  external: { $ne: true },
				  feed_to_takeover_id: { $exists: false }
				}, sinon.match.any)
				.chain('exec')
				.yields(null, feed_obj);

				return podcastForFeedWithIdentifier(
					{}, {
						identifier: feed_identifier
					}
				).then(() => {
					FeedMock
					.expects('findOne').withArgs({_id: feed_id.toString()}, sinon.match.any)
					.chain('exec')
					.yields(null, feed_obj);

					return podcastForFeedWithIdentifier(
						{}, {
							identifier: feed_alias
						}
					).then(() => {
						FeedMock.verify();

						return Promise.resolve();
					});
				});
			});

			it("should cache identifiers and delete this cache when obsolete", () => {
				const feed_id = ObjectId("4eb6e7e7e9b7f4194e000001")
				const feed_identifier = "podcast"
				const feed_alias = "other-podcast"
				const feed_obj = new Feed({
					_id: feed_id,
					identifier: feed_identifier, 
					_slugs:[feed_identifier, feed_alias]
				})

				// Do full query and create cache
				FeedMock
				.expects('findOne')
				.withArgs({
				  $or: [{ custom_domain: feed_identifier }, { identifier: feed_identifier }, { _slugs: feed_identifier }],
				  draft: { $ne: true },
				  external: { $ne: true },
				  feed_to_takeover_id: { $exists: false }
				}, sinon.match.any)
				.chain('exec')
				.yields(null, feed_obj);

				return podcastForFeedWithIdentifier(
					{}, {
						identifier: feed_identifier
					}
				).then(() => {
					feed_obj._slugs = [feed_identifier];

					// use cache, and update it
					FeedMock
					.expects('findOne').withArgs({_id: feed_id.toString()}, sinon.match.any)
					.chain('exec')
					.yields(null, feed_obj);

					return podcastForFeedWithIdentifier(
						{}, {
							identifier: feed_alias
						}
					).then(() => {

						// should not it cache, and do full query
						FeedMock
						.expects('findOne')
						.withArgs({
						  $or: [{ custom_domain: feed_alias }, { identifier: feed_alias }, { _slugs: feed_alias }],
						  draft: { $ne: true },
						  external: { $ne: true },
						  feed_to_takeover_id: { $exists: false }
						}, sinon.match.any)
						.chain('exec')
						.yields(null, feed_obj);

						return podcastForFeedWithIdentifier(
							{}, {
								identifier: feed_alias
							}
						).then(() => {
							FeedMock.verify();

							return Promise.resolve();
						});
					});
				});
			});
		});
	});
});