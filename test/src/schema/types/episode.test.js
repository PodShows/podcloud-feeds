import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js"

describe("Episode Graph Object", () => {
	const schema = buildSchema();
	const fields = schema.getType("Episode").getFields();

	const obj = {
		feed: { identifier: "toto" },
		_slugs: ["test", "abc"],
		enclosure: {
			duration_in_seconds: 600,
			length: "123521",
			mime_type: "audio/mpeg",
			meta_url: {
				path: "http://anurl.test/afile.mp3"
			}
		}
	}

	it("should include and resolve a required Enclosure", testGraphQLProperty(
		fields,
		"enclosure",
		new graphql.GraphQLNonNull(schema.getType("Enclosure")),
		obj,
		obj.enclosure
	))

	it("should include and resolve a required cover_url", testGraphQLProperty(
		fields,
		"cover_url",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		"http://toto.lepodcast.fr/abc/cover"
	))

})