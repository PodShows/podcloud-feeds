import { makeExecutableSchema } from 'graphql-tools'
import { expect } from "chai"
import sinon from "sinon"

export function makeTestExecutableSchemaFactory(name, typeDefs, resolvers) {
	return () => {
		return makeExecutableSchema({
			typeDefs: [
				typeDefs, `
					schema {
					  query: TestQuery
					}

					type TestQuery {
					  test: ${name}
					}
				`
			],
			resolvers: {
				TestQuery: { test() {} },
				[name]: resolvers
			},
			resolverValidationOptions: { 
				requireResolversForAllFields: true 
			}
		})
	}
}

export function testSchema(testExecutableSchemaFactory) {
	return () => {
    	sinon.stub(console, "warn");

    	let schema = testExecutableSchemaFactory();

		if(console.warn.called) {
    		throw new Error(console.warn.getCall(0).args.join(", "));
		}

		console.warn.restore();
		expect(schema).to.be.an("object");
	}
}