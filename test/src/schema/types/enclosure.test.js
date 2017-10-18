import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema } from "#/helpers/schema.helper.js"

describe("Enclosure Graph Object", () => {
	const schema = buildSchema();
	const enclosureFields = schema.getType("Enclosure").getFields();

	const enclosureObject = {
		duration_in_seconds: 600,
		length: "123521",
		mime_type: "audio/mpeg",
		meta_url: {
			path: "http://anurl.test/afile.mp3"
		}
	}

	it("should include a required int duration", () => {
		expect(enclosureFields).to.have.property('duration');
		expect(enclosureFields.duration.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLInt));
	})

	it("should resolve duration", () => {
		expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(600);
	})

	it("should include a required string size", () => {
		expect(enclosureFields).to.have.property('size');
		expect(enclosureFields.size.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLInt));
	})

	it("should resolve size", () => {
		expect(enclosureFields.size.resolve(enclosureObject)).to.equals(123521);
	})

	it("should include a required string type", () => {
		expect(enclosureFields).to.have.property('type');
		expect(enclosureFields.type.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should resolve type", () => {
		expect(enclosureFields.type.resolve(enclosureObject)).to.equals("audio/mpeg");
	})

	it("should include a required string url", () => {
		expect(enclosureFields).to.have.property('url');
		expect(enclosureFields.url.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should resolve url", () => {
		expect(enclosureFields.url.resolve(enclosureObject)).to.equals("http://anurl.test/afile.mp3");
	})

})