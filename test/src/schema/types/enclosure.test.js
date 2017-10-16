
import { expect } from "chai";
import { makeExecutableSchema } from 'graphql-tools';
import sinon from "sinon"
import sinonChai from "sinon-chai"

// 
import enclosureTypeDefs from "~/schema/types/enclosure";
import enclosureResolver from "~/schema/types/resolvers/enclosure";

describe("Enclosure Graph Object", () => {
	it("should have a valid schema", () => {

    	sinon.spy(console, "warn");

		const schema = makeExecutableSchema({
			typeDefs: [
				enclosureTypeDefs, `
					schema {
					  query: TestQuery
					}

					type TestQuery {
					  test: Enclosure
					}
				`
			],
			resolvers: {
				TestQuery: { test() {} },
				Enclosure: enclosureResolver
			},
			resolverValidationOptions: { 
				requireResolversForAllFields: true 
			}
		})

		if(console.warn.called) {
    		throw new Error(console.warn.getCall(0).args.join(", "));
		}

		console.warn.restore();
		expect(schema).to.be.an("object");
	});
});
