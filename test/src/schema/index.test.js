import { expect } from "chai";

import { typeDefs, Resolvers } from '~/schema';
import { makeExecutableSchema } from 'graphql-tools';

describe("Schema", () => {
	it("should be a valid GraphQL schema", () => {
		let schema = makeExecutableSchema({
			typeDefs: typeDefs,
			resolvers: Resolvers
		});

		expect(schema).to.be.a("object");
	});
});