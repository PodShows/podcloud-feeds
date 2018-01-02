import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js"
import { context } from "#/helpers/server.helper"

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

	before(() => {
		testGraphQLProperty.context = context
	})

	after(() => {
		testGraphQLProperty.restore()
	})

	it("should include and resolve a required Enclosure", testGraphQLProperty(
		fields,
		"enclosure",
		new graphql.GraphQLNonNull(schema.getType("Enclosure")),
		obj,
		obj.enclosure
	))

	describe("should include and resolve a required cover_url", () => {
		it("without custom_domain", () => {
			testGraphQLProperty(
				fields,
				"cover_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				obj,
				`http://${obj.feed.identifier}.${context.hosts.podcasts}/abc/enclosure/cover.png`
			)()
		})

		it("with custom_domain", () => {
			const o = { ...obj, feed: { custom_domain: "monpodcast.fr" } }
			testGraphQLProperty(
				fields,
				"cover_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				`http://${o.feed.custom_domain}/abc/enclosure/cover.png`
			)()
		})

		it("with platform subdomain", () => {
			const o = { ...obj, feed: { identifier: "blog" } }
			testGraphQLProperty(
				fields,
				"cover_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				`http://${o.feed.identifier}.${context.hosts.platform}/abc/enclosure/cover.png`
			)()
		})

	})

})