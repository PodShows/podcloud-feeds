import { expect } from "chai";

import rootQuery from '~/schema/resolvers/queries/rootQuery';

describe("Resolvers", () => {
	describe("queries", () => {
		describe("rootQuery", () => {
			it("should have *podcasts* query", () => {
				expect(rootQuery).to.have.ownProperty("podcasts");
				expect(rootQuery.podcasts).to.be.a("function");
			});

			it("should have *podcastForFeedWithIdentifier* query", () => {
				expect(rootQuery).to.have.ownProperty("podcastForFeedWithIdentifier");
				expect(rootQuery.podcastForFeedWithIdentifier).to.be.a("function");
			});
		});
	});
});