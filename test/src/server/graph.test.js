import { expect } from "chai";

import * as testServer from "#/helpers/server.helper";
import MongoHelper from "#/helpers/mongodb.helper";

describe("GraphQL Server", () => {
  before(done => {
    testServer.start(() => {
      MongoHelper.setup(done);
    });
  });

  it("should answer requests", () => {
    return testServer
      .graphqlQuery(
        `
			{
			  __schema {
			    queryType {
			      kind
			    }
			  }
			}
		`
      )
      .then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.body.data).to.deep.equal({
          __schema: {
            queryType: {
              kind: "OBJECT"
            }
          }
        });
      });
  });

  describe("podcast query", () => {
    it("should return a podcast using its identifier", () => {
      return testServer
        .graphqlQuery(
          `
				{
				  podcast(identifier: "blog") {
				  	identifier
				  }
				}
			`
        )
        .then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.data).to.deep.equal({
            podcast: {
              identifier: "blog"
            }
          });
        });
    });

    it("should return a podcast using an older identifier", () => {
      return testServer
        .graphqlQuery(
          `
				{
				  podcast(identifier: "webiblog") {
				  	identifier
				  }
				}
			`
        )
        .then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.data).to.deep.equal({
            podcast: {
              identifier: "blog"
            }
          });
        });
    });

    it("should return an external podcast", () => {
      return testServer
        .graphqlQuery(
          `
				{
				  podcast(identifier: "france-bleu-auvergne") {
				  	identifier
				  }
				}
			`
        )
        .then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.data).to.deep.equal({
            podcast: {
              identifier: "france-bleu-auvergne"
            }
          });
        });
    });

    it("should not return drafts", () => {
      return testServer
        .graphqlQuery(
          `
				{
				  podcast(identifier: "draft") {
				  	identifier
				  }
				}
			`
        )
        .then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.data).to.deep.equal({
            podcast: null
          });
        });
    });

    it("should not return an ongoing takeover", () => {
      return testServer
        .graphqlQuery(
          `
				{
				  podcast(identifier: "fiction") {
				  	identifier
				  	catchline
				  }
				}
			`
        )
        .then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.body.data).to.deep.equal({
            podcast: {
              identifier: "fiction",
              catchline: "Fictionite" // Not "Takeovering"
            }
          });
        });
    });

    describe("podcast", function() {
      it("should not include unpublished items", () => {
        return testServer
          .graphqlQuery(
            `
					{
					  podcast(identifier: "blog") {
					  	items {
					  		title
					  	}
					  }
					}
				`
          )
          .then(response => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.data).to.have.property("podcast");

            const feed = response.body.data.podcast;

            expect(feed.items).to.be.an("array").that.is.not.empty;

            expect(feed.items).to.not.deep.include({
              title: "Blog post dans le turfu"
            });

            expect(feed.items).to.not.deep.include({
              title: "Blog post dans le passé mais cassé"
            });

            expect(feed.items).to.not.deep.include({
              title: "Blog post dans le passé mais privé"
            });
          });
      });

      it("should respect items order", () => {
        return testServer
          .graphqlQuery(
            `
					{
					  podcast(identifier: "blog") {
					  	identifier
					  	items {
					  		published_at
					  	}
					  }
					}
				`
          )
          .then(response => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.data).to.have.property("podcast");

            const feed = response.body.data.podcast;

            expect(feed.items)
              .to.be.an("array")
              .and.have.lengthOf.above(1);

            const first_post = feed.items[0];
            const last_post = feed.items[feed.items.length - 1];
            expect(Date.parse(first_post.published_at)).to.be.above(
              Date.parse(last_post.published_at)
            );

            return testServer.graphqlQuery(`
						{
						  podcast(identifier: "fiction") {
						  	identifier
						  	items {
						  		published_at
						  	}
						  }
						}
					`);
          })
          .then(response => {
            expect(response.statusCode).to.equal(200);
            expect(response.body.data).to.have.property("podcast");

            const feed = response.body.data.podcast;

            expect(feed.items)
              .to.be.an("array")
              .and.have.lengthOf.above(1);

            const first_post = feed.items[0];
            const last_post = feed.items[feed.items.length - 1];
            expect(Date.parse(first_post.published_at)).to.be.below(
              Date.parse(last_post.published_at)
            );
          });
      });
    });
  });

  after(done => {
    testServer.stop(() => {
      MongoHelper.tearDown(done);
    });
  });
});
