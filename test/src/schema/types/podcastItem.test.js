import { expect } from "chai"
import sinon from "sinon"

import { Types as mongooseTypes } from "mongoose"

import * as graphql from "graphql"
import { buildSchema } from "#/helpers/schema.helper.js"
import { context } from "#/helpers/server.helper"


describe("PodcastItem Graph Object", () => {
	const schema = buildSchema();
	const graph_interface = schema.getType("PodcastItem");
	const fields = graph_interface.getFields();

	it("should be an interface", () => {
		expect(schema.getType("PodcastItem")).to.be.an.instanceof(graphql.GraphQLInterfaceType)
	})

	it("should expose a required string guid", () => {
		expect(fields).to.have.property('guid');
		expect(fields.guid.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should expose a required string title", () => {
		expect(fields).to.have.property('title');
		expect(fields.title.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should expose a required string text_content", () => {
		expect(fields).to.have.property('text_content');
		expect(fields.text_content.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should expose a required string formatted_content", () => {
		expect(fields).to.have.property('formatted_content');
		expect(fields.formatted_content.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should expose a required string published_at", () => {
		expect(fields).to.have.property('published_at');
		expect(fields.published_at.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should expose a required string url", () => {
		expect(fields).to.have.property('url');
		expect(fields.url.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLString));
	})

	it("should expose a string author", () => {
		expect(fields).to.have.property('author');
		expect(fields.author.type).to.deep.equals(graphql.GraphQLString);
	})

	it("should expose a required boolean explicit", () => {
		expect(fields).to.have.property('explicit');
		expect(fields.explicit.type).to.deep.equals(new graphql.GraphQLNonNull(graphql.GraphQLBoolean));
	})

	it("should resolve to Post when no enclosure is available", () => {
		const obj = {}
		const resolvedType = graph_interface.resolveType(obj, {}, { schema });

		expect(resolvedType).to.deep.equals(schema.getType("Post"))
	})

	it("should resolve an Episode when an enclosure is available", () => {
		const obj = { 
			enclosure: {
				meta_url: {
					path: "http://anurl.test/afile.mp3"
				}
			}
		}

		const resolvedType = graph_interface.resolveType(obj, {}, { schema });

		expect(resolvedType).to.deep.equals(schema.getType("Episode"))
	})

	const Types = [
		"Episode",
		"Post"
	]

	Types.forEach((name) => {
		const resolvedType = schema.getType(name)
		const resolvedFields = resolvedType.getFields();

    	const _id = new mongooseTypes.ObjectId()
    	const published_at = new Date(Date.UTC(2009, 4, 1, 19, 30, 42))

		const obj = {
			_id,
			feed: { identifier: "totocast" },
			title: "toto",
			explicit: true,
			author: "toto l'asticot",
			content: "# Titre\n\ntest *gras*",
			published_at,
			_slugs: ["titi", "tata", "toto"],
			link: "http://montoto.com/monpost",
		}

		describe("resolved "+resolvedType.name, () => {
			it("should resolve guid", () => {
				expect(resolvedFields).to.have.property('guid');
				expect(resolvedFields.guid.resolve(obj)).to.equals(_id.toString());
			})

			it("should resolve title", () => {
				expect(resolvedFields).to.have.property('title');
				expect(resolvedFields.title.resolve(obj)).to.equals(obj.title);
			})

			it("should resolve text_content", () => {
				expect(resolvedFields).to.have.property('text_content');
				expect(resolvedFields.text_content.resolve(obj)).to.equals(obj.content);
			})

			it.skip("should resolve formatted_content", () => {
				expect(resolvedFields).to.have.property('formatted_content');
				expect(resolvedFields.formatted_content.resolve(obj)).to.equals("<h1>Titre</h1>\ntest <strong>gras</strong>");
			})

			it("should resolve published_at", () => {
				expect(resolvedFields).to.have.property('published_at');
				expect(resolvedFields.published_at.resolve(obj)).to.equals("Fri, 01 May 2009 19:30:42 +0000");
			})

			describe("should resolve string url", () => {
				it("with link", () => {
					expect(resolvedFields).to.have.property('url');
					expect(resolvedFields.url.resolve(obj, {}, context)).to.equals(obj.link);
				})

				describe("without link", () => {
					it("without custom_domain", () => {
						const o = {...obj, link: undefined }
						expect(resolvedFields).to.have.property('url');
						expect(resolvedFields.url.resolve(o, {}, context)).to.equals(
							`http://${o.feed.identifier}.${context.hosts.podcasts}/${o._slugs[o._slugs.length-1]}`
						);
					})

					it("with custom_domain", () => {
						const o = {...obj, feed: { custom_domain: "monpodcast.com" }, link: undefined }
						expect(resolvedFields).to.have.property('url');
						expect(resolvedFields.url.resolve(o, {}, context)).to.equals(
							`http://monpodcast.com/${o._slugs[o._slugs.length-1]}`
						);
					})

					it("with platform subdomain", () => {
						const o = {...obj, feed: { identifier: "blog" }, link: undefined }
						expect(resolvedFields).to.have.property('url');
						expect(resolvedFields.url.resolve(o, {}, context)).to.equals(
							`http://${o.feed.identifier}.${context.hosts.platform}/${o._slugs[o._slugs.length-1]}`
						);
					})
				})
			})

			it("should resolve author", () => {
				expect(resolvedFields).to.have.property('author');
				expect(resolvedFields.author.resolve(obj)).to.equals(obj.author);
			})

			it("should resolve explicit", () => {
				expect(resolvedFields).to.have.property('explicit');
				expect(resolvedFields.explicit.resolve(obj)).to.be[(obj.explicit ? "true" : "false")]
			})

		})
	})
})