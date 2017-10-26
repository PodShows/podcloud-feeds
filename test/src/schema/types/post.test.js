import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js"

describe("Post Graph Object", () => {
	const schema = buildSchema();
	const fields = schema.getType("Post").getFields();

	it("has already been fully tested by PodcastItem tests", (done) => { 
		done();
	})
})