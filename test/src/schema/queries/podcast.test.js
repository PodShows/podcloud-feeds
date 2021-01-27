import proxyquire from "proxyquire";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import "sinon-mongoose";

import { Types } from "mongoose";
const ObjectId = Types.ObjectId;

import Feed from "~/connectors/feed";

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("Schema", () => {
  describe("queries", () => {
    describe("podcast", () => {
      var podcast;
      var FeedMock;

      beforeEach(function() {
        FeedMock = sinon.mock(Feed);

        podcast = proxyquire(
          "../../../../src/schema/queries/resolvers/podcast",
          {
            Feed
          }
        ).default;

        podcast.clearCache();
      });

      afterEach(function() {
        FeedMock.restore();
      });

      it("should return a promise", () => {
        const query = podcast({}, { identifier: "" }).then(() => {}, () => {});
        expect(query).to.be.a("promise");
      });

      it("should reject the promise when identifier is not a string", () => {
        const query = podcast({}, { identifier: null });
        expect(query).to.be.a("promise");
        return expect(query).to.be.eventually.rejected;
      });

      it("should reject the promise when identifier is an empty string", () => {
        FeedMock.expects("findOne");
        const query = podcast({}, { identifier: " " });

        expect(query).to.be.a("promise");
        return expect(query).to.be.eventually.rejected;
      });

      it("should reject the promise when database has an error", () => {
        const err_msg =
          "Error occured (simulated at " + +new Date() / 1000 + ")";

        FeedMock.expects("findOne")
          .chain("exec")
          .yields(err_msg, null);

        const query = podcast({}, { identifier: "unknown" });

        expect(query).to.be.a("promise");
        return expect(query).to.be.eventually.rejectedWith(err_msg);
      });

      it("with unknown identifier should resolve null", () => {
        FeedMock.expects("findOne")
          .chain("exec")
          .yields(undefined, null);

        FeedMock.expects("findOne")
          .chain("exec")
          .yields(undefined, null);

        const query = podcast({}, { identifier: "unknown" });
        expect(query).to.be.a("promise");

        return query.then(
          () => {
            FeedMock.verify();
            return Promise.resolve();
          },
          err => {
            return Promise.reject(err);
          }
        );
      });

      it("with known id, should resolve a feed and update cache", () => {
        const feed_id = ObjectId("4eb6e7e7e9b7f4194e000001").toString();
        const feed_identifier = "test-identifier";
        const feed_alias = "old-test-identifier";

        const feed_obj = new Feed({
          _id: feed_id,
          identifier: feed_identifier,
          _slugs: [feed_identifier, feed_alias]
        });

        FeedMock.expects("findOne")
          .withArgs({ _id: feed_id })
          .chain("exec")
          .yields(null, feed_obj);

        return podcast(
          {},
          {
            _id: feed_id
          }
        )
          .then(() => {
            FeedMock.expects("findOne")
              .withArgs({ _id: feed_id })
              .chain("exec")
              .yields(null, feed_obj);

            return podcast(
              {},
              {
                identifier: feed_alias
              }
            );
          })
          .then(() => {
            FeedMock.expects("findOne")
              .withArgs({ _id: feed_id })
              .chain("exec")
              .yields(null, feed_obj);

            return podcast(
              {},
              {
                identifier: feed_identifier
              }
            );
          })
          .then(() => {
            FeedMock.verify();

            return Promise.resolve();
          });
      });

      it("with known identifier should resolve a feed", () => {
        FeedMock.expects("findOne")
          .chain("exec")
          .yields(null, new Feed({ identifier: "podcast" }));

        const query = podcast({}, { identifier: "podcast" });
        expect(query).to.be.a("promise");

        return query.then(
          () => {
            FeedMock.verify();
            return Promise.resolve();
          },
          err => {
            return Promise.reject(err);
          }
        );
      });

      it("should cache identifiers and use this cache to resolve a feed", () => {
        const feed_id = ObjectId("4eb6e7e7e9b7f4194e000001");
        const feed_identifier = "podcast";
        const feed_alias = "other-podcast";
        const feed_obj = new Feed({
          _id: feed_id,
          identifier: feed_identifier,
          _slugs: [feed_identifier, feed_alias]
        });

        FeedMock.expects("findOne")
          .withArgs({
            $and: [
              {
                $or: [
                  { feed_to_takeover_id: { $exists: false } },
                  { feed_to_takeover_id: null }
                ]
              },
              {
                $or: [
                  { identifier: feed_identifier },
                  { _slugs: feed_identifier }
                ]
              }
            ],
            draft: { $ne: true },
            external: { $ne: true }
          })
          .chain("exec")
          .yields(null, feed_obj);

        return podcast(
          {},
          {
            identifier: feed_identifier
          }
        ).then(() => {
          FeedMock.expects("findOne")
            .withArgs({ _id: feed_id.toString() })
            .chain("exec")
            .yields(null, feed_obj);

          return podcast(
            {},
            {
              identifier: feed_alias
            }
          ).then(() => {
            FeedMock.verify();

            return Promise.resolve();
          });
        });
      });

      it("should cache identifiers and delete this cache when obsolete", () => {
        const feed_id = ObjectId("4eb6e7e7e9b7f4194e000001");
        const feed_identifier = "podcast";
        const feed_alias = "other-podcast";
        const feed_obj = new Feed({
          _id: feed_id,
          identifier: feed_identifier,
          _slugs: [feed_identifier, feed_alias]
        });

        // Do full query and create cache
        FeedMock.expects("findOne")
          .withArgs({
            $and: [
              {
                $or: [
                  { feed_to_takeover_id: { $exists: false } },
                  { feed_to_takeover_id: null }
                ]
              },
              {
                $or: [
                  { identifier: feed_identifier },
                  { _slugs: feed_identifier }
                ]
              }
            ],
            draft: { $ne: true },
            external: { $ne: true }
          })
          .chain("exec")
          .yields(null, feed_obj);

        return podcast(
          {},
          {
            identifier: feed_identifier
          }
        ).then(feed => {
          expect(feed).to.not.be.null;

          feed_obj._slugs = [feed_identifier];

          // use cache, and update it
          FeedMock.expects("findOne")
            .withArgs({ _id: feed_id.toString() })
            .chain("exec")
            .yields(null, feed_obj);

          return podcast(
            {},
            {
              identifier: feed_alias
            }
          ).then(() => {
            // should not it cache, and do full query
            FeedMock.expects("findOne")
              .withArgs({
                $and: [
                  {
                    $or: [
                      { feed_to_takeover_id: { $exists: false } },
                      { feed_to_takeover_id: null }
                    ]
                  },
                  {
                    $or: [{ identifier: feed_alias }, { _slugs: feed_alias }]
                  }
                ],
                draft: { $ne: true },
                external: { $ne: true }
              })
              .chain("exec")
              .yields(null, feed_obj);

            return podcast(
              {},
              {
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
