import { expect } from "chai";

import podcasts from '~/schema/resolvers/queries/podcasts';

describe("Resolvers", () => {
	describe("queries", () => {
		describe("podcasts", () => {
			it("should return a promise", () => {
				const query = podcasts()
				expect(query).to.be.a('promise');
			});
		});
	});
});