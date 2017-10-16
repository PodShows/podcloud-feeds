
import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { testSchema, makeTestExecutableSchemaFactory } from "#/helpers/testSchemas.js"

import enclosureTypeDefs from "~/schema/types/enclosure"
import enclosureResolvers from "~/schema/types/resolvers/enclosure"

const enclosureSchemaFactory = makeTestExecutableSchemaFactory(
	"Enclosure",
	enclosureTypeDefs,
	enclosureResolvers
)

describe("Enclosure Graph Object", () => {

	it("should have a valid schema", testSchema(enclosureSchemaFactory))
	
	describe("fields", () => {
		const enclosureFields = enclosureSchemaFactory().getType("Enclosure").getFields();

		it("should include a required int duration", () => {
			expect(enclosureFields).to.have.property('duration');
			expect(enclosureFields.duration.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLInt));
		})

		it("should include a required string size", () => {
			expect(enclosureFields).to.have.property('size');
			expect(enclosureFields.size.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLInt));
		})

		it("should include a required string type", () => {
			expect(enclosureFields).to.have.property('type');
			expect(enclosureFields.type.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
		})

		it("should include a required string url", () => {
			expect(enclosureFields).to.have.property('url');
			expect(enclosureFields.url.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
		})
	})


	describe("resolvers", () => {
		const enclosureFields = enclosureSchemaFactory().getType("Enclosure").getFields();
		const enclosureObject = {
			duration_in_seconds: 600,
			length: "123521",
			mime_type: "audio/mpeg",
			meta_url: {
				path: "http://anurl.test/afile.mp3"
			}
		}

		it("should resolve duration", () => {
			expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(600);
		})

		it("should resolve size", () => {
			expect(enclosureFields.size.resolve(enclosureObject)).to.equals(123521);
		})

		it("should resolve type", () => {
			expect(enclosureFields.type.resolve(enclosureObject)).to.equals("audio/mpeg");
		})

		it("should resolve url", () => {
			expect(enclosureFields.url.resolve(enclosureObject)).to.equals("http://anurl.test/afile.mp3");
		})

	})

});
