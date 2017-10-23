import { expect } from "chai"
import sinon from "sinon"

import * as graphql from "graphql"
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js"

import path from 'path';

describe("Podcast Graph Object", () => {
	const schema = buildSchema();
	const fields = schema.getType("Podcast").getFields();

   	const created_at = new Date(Date.UTC(2009, 4, 1, 19, 30, 42))
	const updated_at = new Date(Date.UTC(2009, 4, 1, 20, 30, 42))

	const obj = {
		title: "test titre",
		identifier: "testidentifier",
		catchline: "test catchline",
		description: "ze description",
		copyright: "2006 lol",
		language: "fr",
		contact_email: "email",
		author: "authored",
		cover_filename: "toto.png",
		created_at,
		updated_at,
		external: false,
		parent_feed: "http://parent_feed.com",
		link: "http://parent_web.com",
		explicit: true,
		tags: "test,tags,lol",
		block_itunes: false,
		itunes_category: "",
		disabled: false,
		feed_redirect_url: "http://redirect_feed",
		web_redirect_url: "http://redirect_web",
	}

	it("should include and resolve a required string title", testGraphQLProperty(
		fields,
		"title",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		obj.title
	))

	it("should include and resolve a required string identifier", testGraphQLProperty(
		fields,
		"identifier",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		obj.identifier
	))

	it("should include and resolve a required string catchline", testGraphQLProperty(
		fields,
		"catchline",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		obj.catchline
	))

	it("should include and resolve a string copyright", testGraphQLProperty(
		fields,
		"copyright",
		graphql.GraphQLString,
		obj,
		obj.copyright
	))

	it("should include and resolve a required string description", testGraphQLProperty(
		fields,
		"description",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		obj.description
	))
	
	it("should include and resolve a required string language", testGraphQLProperty(
		fields,
		"language",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		obj.language
	))

	it("should include and resolve a string contact email", testGraphQLProperty(
		fields,
		"contact_email",
		graphql.GraphQLString,
		obj,
		obj.contact_email
	))

	it("should include and resolve a string author", testGraphQLProperty(
		fields,
		"author",
		graphql.GraphQLString,
		obj,
		obj.author
	))

	it("should include and resolve a required string cover_url", () => {
		let identifier = obj.identifier
		let ext = path.extname(obj.cover_filename)

		testGraphQLProperty(
			fields,
			"cover_url",
			new graphql.GraphQLNonNull(graphql.GraphQLString),
			obj,
			`http://${identifier}.lepodcast.fr/cover${ext}`
		)();
	})

	it("should include and resolve a required string published_at", testGraphQLProperty(
		fields,
		"created_at",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		"Fri, 01 May 2009 19:30:42 +0000"
	))

	it("should include and resolve a required string published_at", testGraphQLProperty(
		fields,
		"updated_at",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		"Fri, 01 May 2009 20:30:42 +0000"
	))

	it("should include and resolve a required string published_at", testGraphQLProperty(
		fields,
		"created_at",
		new graphql.GraphQLNonNull(graphql.GraphQLString),
		obj,
		"Fri, 01 May 2009 19:30:42 +0000"
	))

	it("should include and resolve a required boolean internal", testGraphQLProperty(
		fields,
		"internal",
		new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
		obj,
		true
	))

	describe("should include and resolve a required string feed_url", () => {
		it("internal feed", () => {
			const o = {
				...obj,
				external: false,
				identifier: "toto"
			}

			testGraphQLProperty(
				fields,
				"feed_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				"http://"+o.identifier+".lepodcast.fr/rss"
			)()
		});

		it("external feed with http", () => {
			const o = {
				...obj,
				external: true,
				parent_feed: "https://toto.com/feed"
			}

			testGraphQLProperty(
				fields,
				"feed_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				o.parent_feed
			)()
		});

		it("external feed without http", () => {
			const o = {
				...obj,
				external: true,
				parent_feed: "toto.com/feed"
			}

			testGraphQLProperty(
				fields,
				"feed_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				"http://"+o.parent_feed
			)()
		});
	})

	describe("should include and resolve a required string website_url", () => {
		it("without website", () => {
			const o = {
				...obj,
				external: false,
				identifier: "toto",
				link: null
			}

			testGraphQLProperty(
				fields,
				"website_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				"http://"+o.identifier+".lepodcast.fr/"
			)()
		});

		it("external website with http", () => {
			const o = {
				...obj,
				external: true,
				link: "https://toto.com"
			}

			testGraphQLProperty(
				fields,
				"website_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				o.link
			)()
		});

		it("external website without http", () => {
			const o = {
				...obj,
				external: true,
				link: "toto.com"
			}

			testGraphQLProperty(
				fields,
				"website_url",
				new graphql.GraphQLNonNull(graphql.GraphQLString),
				o,
				"http://"+o.link
			)()
		});
	})

	it("should include and resolve a required boolean external", testGraphQLProperty(
		fields,
		"external",
		new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
		obj,
		false
	))

	it.skip(`should test the following list of attributes : 
	- tags
	- explicit
	- itunes_block
	- itunes_category
	- disabled
	- feed_redirect_url
	- web_redirect_url
	- items`)

})