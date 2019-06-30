import { expect } from "chai"
import sinon from "sinon"

import { Types as mongooseTypes } from "mongoose"

import * as graphql from "graphql"
import { buildSchema } from "#/helpers/schema.helper.js"
import { context } from "#/helpers/server.helper"

describe("PodcastItem Graph Object", () => {
  const schema = buildSchema()
  const graph_interface = schema.getType("PodcastItem")
  const fields = graph_interface.getFields()

  it("should be an interface", () => {
    expect(schema.getType("PodcastItem")).to.be.an.instanceof(
      graphql.GraphQLInterfaceType
    )
  })

  it("should expose a required string guid", () => {
    expect(fields).to.have.property("guid")
    expect(fields.guid.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should expose a required string title", () => {
    expect(fields).to.have.property("title")
    expect(fields.title.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should expose a required string text_content", () => {
    expect(fields).to.have.property("text_content")
    expect(fields.text_content.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should expose a required string formatted_content", () => {
    expect(fields).to.have.property("formatted_content")
    expect(fields.formatted_content.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should expose a required string published_at", () => {
    expect(fields).to.have.property("published_at")
    expect(fields.published_at.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should expose a required string url", () => {
    expect(fields).to.have.property("url")
    expect(fields.url.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    )
  })

  it("should expose a string author", () => {
    expect(fields).to.have.property("author")
    expect(fields.author.type).to.deep.equals(graphql.GraphQLString)
  })

  it("should expose a required boolean explicit", () => {
    expect(fields).to.have.property("explicit")
    expect(fields.explicit.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
    )
  })

  it("should expose a episode_type string", () => {
    expect(fields).to.have.property("episode_type")
    expect(fields.episode_type.type).to.deep.equals(graphql.GraphQLString)
  })

  it("should expose a season integer", () => {
    expect(fields).to.have.property("season")
    expect(fields.season.type).to.deep.equals(graphql.GraphQLInt)
  })

  it("should expose an episode integer", () => {
    expect(fields).to.have.property("episode")
    expect(fields.episode.type).to.deep.equals(graphql.GraphQLInt)
  })

  it("should resolve to Post when no enclosure is available", () => {
    const obj = {}
    const resolvedType = graph_interface.resolveType(obj, {}, { schema })

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

    const resolvedType = graph_interface.resolveType(obj, {}, { schema })

    expect(resolvedType).to.deep.equals(schema.getType("Episode"))
  })

  const Types = ["Episode", "Post"]

  Types.forEach(name => {
    const resolvedType = schema.getType(name)
    const resolvedFields = resolvedType.getFields()

    const _id = new mongooseTypes.ObjectId()
    const published_at = new Date(Date.UTC(2009, 4, 1, 19, 30, 42))

    const obj = {
      _id,
      feed: { identifier: "totocast" },
      title: "toto",
      explicit: true,
      author: "toto l'asticot",
      content: `
# Titre

test **gras** 

![Une image](http://image.com/img.jpg)
[Un lien](http://google.com)

http://unlienauto.com/
			`.trim(),
      published_at,
      _slugs: ["titi", "tata", "toto"],
      link: "http://montoto.com/monpost"
    }

    describe("resolved " + resolvedType.name, () => {
      it("should resolve guid", () => {
        expect(resolvedFields).to.have.property("guid")
        expect(resolvedFields.guid.resolve(obj)).to.equals(_id.toString())
      })

      it("should resolve title", () => {
        expect(resolvedFields).to.have.property("title")
        expect(resolvedFields.title.resolve(obj)).to.equals(obj.title)
      })

      it("should resolve text_content", () => {
        expect(resolvedFields).to.have.property("text_content")
        expect(resolvedFields.text_content.resolve(obj)).to.equals(obj.content)
      })

      it("should resolve formatted_content", () => {
        expect(resolvedFields).to.have.property("formatted_content")
        expect(resolvedFields.formatted_content.resolve(obj)).to.equals(
          `<h1>Titre</h1>
<p>test <strong>gras</strong> </p>
<p><img src="http://image.com/img.jpg" alt="Une image"><br><a href="http://google.com">Un lien</a></p>
<p><a href="http://unlienauto.com/">http://unlienauto.com/</a></p>
`
        )
      })

      it("should resolve published_at", () => {
        expect(resolvedFields).to.have.property("published_at")
        expect(resolvedFields.published_at.resolve(obj)).to.equals(
          "Fri, 01 May 2009 19:30:42 +0000"
        )
      })

      describe("should resolve string url", () => {
        it("with link", () => {
          expect(resolvedFields).to.have.property("url")
          expect(resolvedFields.url.resolve(obj, {}, context)).to.equals(
            obj.link
          )
        })

        describe("without link", () => {
          it("without custom_domain", () => {
            const o = {
              ...obj,
              link: undefined
            }
            expect(resolvedFields).to.have.property("url")
            expect(resolvedFields.url.resolve(o, {}, context)).to.equals(
              `http://${o.feed.identifier}.${context.hosts.podcasts}/${
                o._slugs[o._slugs.length - 1]
              }`
            )
          })

          it("with custom_domain", () => {
            const o = {
              ...obj,
              feed: { custom_domain: "monpodcast.com" },
              link: undefined
            }
            expect(resolvedFields).to.have.property("url")
            expect(resolvedFields.url.resolve(o, {}, context)).to.equals(
              `http://monpodcast.com/${o._slugs[o._slugs.length - 1]}`
            )
          })

          it("with platform subdomain", () => {
            const o = { ...obj, feed: { identifier: "blog" }, link: undefined }
            expect(resolvedFields).to.have.property("url")
            expect(resolvedFields.url.resolve(o, {}, context)).to.equals(
              `http://${o.feed.identifier}.${context.hosts.platform}/${
                o._slugs[o._slugs.length - 1]
              }`
            )
          })
        })
      })

      it("should resolve author", () => {
        expect(resolvedFields).to.have.property("author")
        expect(resolvedFields.author.resolve(obj)).to.equals(obj.author)
      })

      it("should resolve author with feed fallback", () => {
        const o = {
          ...obj,
          feed: { ...obj.feed, author: "author" },
          author: undefined
        }
        expect(resolvedFields).to.have.property("author")
        expect(resolvedFields.author.resolve(o)).to.equals(o.feed.author)
      })

      it("should resolve explicit", () => {
        expect(resolvedFields).to.have.property("explicit")
        expect(resolvedFields.explicit.resolve(obj)).to.be[
          obj.explicit ? "true" : "false"
        ]
      })

      describe("should resolve episode_type, season, and episode", () => {
        it("with full type", () => {
          const o = { ...obj, episode_type: "full" }
          expect(resolvedFields).to.have.property("episode_type")
          expect(resolvedFields.episode_type.resolve(o, {}, context)).to.equals(
            o.episode_type
          )
        })

        it("with trailer type", () => {
          const o = { ...obj, episode_type: "trailer" }
          expect(resolvedFields).to.have.property("episode_type")
          expect(resolvedFields.episode_type.resolve(o, {}, context)).to.equals(
            o.episode_type
          )
        })

        it("with bonus type", () => {
          const o = { ...obj, episode_type: "bonus" }
          expect(resolvedFields).to.have.property("episode_type")
          expect(resolvedFields.episode_type.resolve(o, {}, context)).to.equals(
            o.episode_type
          )
        })

        it("with bad type", () => {
          const o = { ...obj, episode_type: "wtf" }
          expect(resolvedFields).to.have.property("episode_type")
          expect(resolvedFields.episode_type.resolve(o, {}, context)).to.be.null
        })

        it("with season", () => {
          const o = { ...obj, season: 1 }
          expect(resolvedFields).to.have.property("season")
          expect(resolvedFields.season.resolve(o, {}, context)).to.equals(1)
        })

        it("without season", () => {
          const o = { ...obj, season: 0 }
          expect(resolvedFields).to.have.property("season")
          expect(resolvedFields.season.resolve(o, {}, context)).to.be.null

          o.season = undefined

          expect(resolvedFields).to.have.property("season")
          expect(resolvedFields.season.resolve(o, {}, context)).to.be.null
        })

        it("with episode", () => {
          const o = { ...obj, episode: 1 }
          expect(resolvedFields).to.have.property("episode")
          expect(resolvedFields.episode.resolve(o, {}, context)).to.equals(1)
        })
        it("without episode", () => {
          const o = { ...obj, episode: 0 }
          expect(resolvedFields).to.have.property("episode")
          expect(resolvedFields.episode.resolve(o, {}, context)).to.be.null

          o.episode = undefined

          expect(resolvedFields).to.have.property("episode")
          expect(resolvedFields.episode.resolve(o, {}, context)).to.be.null
        })
      })
    })
  })
})
