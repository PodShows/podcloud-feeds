import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import sinon from "sinon"
import sinonChai from "sinon-chai"
import "sinon-mongoose"
import proxyquire from "proxyquire"

import * as graphql from "graphql"
import { buildSchema, testGraphQLProperty } from "#/helpers/schema.helper.js"
import { context } from "#/helpers/server.helper"

import Item from "~/connectors/item"

import path from "path"

import { Types } from "mongoose"
const ObjectId = Types.ObjectId

const expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)

describe("Podcast Graph Object", () => {
  const schema = buildSchema()
  const fields = schema.getType("Podcast").getFields()

  const created_at = new Date(Date.UTC(2009, 4, 1, 19, 30, 42))
  const updated_at = new Date(Date.UTC(2009, 4, 1, 20, 30, 42))

  const obj = {
    _id: ObjectId("a6b7321bf6ab350bcef47624"),
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
    ordering: "asc",
    external: false,
    parent_feed: "http://parent_feed.com",
    link: "http://parent_web.com",
    explicit: true,
    tags: "test,tags,lol",
    block_itunes: false,
    itunes_category: "comedy",
    disabled: false,
    feed_redirect_url: "http://redirect_feed",
    web_redirect_url: "http://redirect_web"
  }

  before(() => {
    testGraphQLProperty.context = context
  })

  after(() => {
    testGraphQLProperty.restore()
  })

  it(
    "should include and resolve a required string _id",
    testGraphQLProperty(
      fields,
      "_id",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj._id.toString()
    )
  )

  it(
    "should include and resolve a required string title",
    testGraphQLProperty(
      fields,
      "title",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj.title
    )
  )

  it(
    "should include and resolve a required string identifier",
    testGraphQLProperty(
      fields,
      "identifier",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj.identifier
    )
  )

  it(
    "should include and resolve a required string catchline",
    testGraphQLProperty(
      fields,
      "catchline",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj.catchline
    )
  )

  it(
    "should include and resolve a string ordering",
    testGraphQLProperty(
      fields,
      "ordering",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj.ordering
    )
  )

  it(
    "should include and resolve a string copyright",
    testGraphQLProperty(
      fields,
      "copyright",
      graphql.GraphQLString,
      obj,
      obj.copyright
    )
  )

  it(
    "should include and resolve a required string description",
    testGraphQLProperty(
      fields,
      "description",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj.description
    )
  )

  it(
    "should include and resolve a required string language",
    testGraphQLProperty(
      fields,
      "language",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      obj.language
    )
  )

  it(
    "should include and resolve a string contact email",
    testGraphQLProperty(
      fields,
      "contact_email",
      graphql.GraphQLString,
      obj,
      obj.contact_email
    )
  )

  it(
    "should include and resolve a string author",
    testGraphQLProperty(
      fields,
      "author",
      graphql.GraphQLString,
      obj,
      obj.author
    )
  )

  it(
    "should include and resolve a required string published_at",
    testGraphQLProperty(
      fields,
      "created_at",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      "Fri, 01 May 2009 19:30:42 +0000"
    )
  )

  it(
    "should include and resolve a required string published_at",
    testGraphQLProperty(
      fields,
      "updated_at",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      "Fri, 01 May 2009 20:30:42 +0000"
    )
  )

  it(
    "should include and resolve a required string published_at",
    testGraphQLProperty(
      fields,
      "created_at",
      new graphql.GraphQLNonNull(graphql.GraphQLString),
      obj,
      "Fri, 01 May 2009 19:30:42 +0000"
    )
  )

  it(
    "should include and resolve a required boolean internal",
    testGraphQLProperty(
      fields,
      "internal",
      new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
      obj,
      true
    )
  )

  describe("should include and resolve a required string feed_url", () => {
    describe("internal feed", () => {
      const feed = {
        ...obj,
        external: false,
        identifier: "toto"
      }

      it("without custom domain", () => {
        testGraphQLProperty(
          fields,
          "feed_url",
          new graphql.GraphQLNonNull(graphql.GraphQLString),
          feed,
          `https://${feed.identifier}.${context.hosts.podcasts}/rss`
        )()
      })

      it("with custom domain", () => {
        const o = { ...feed, custom_domain: "monpodcast.fr" }
        testGraphQLProperty(
          fields,
          "feed_url",
          new graphql.GraphQLNonNull(graphql.GraphQLString),
          o,
          `http://${o.custom_domain}/rss`
        )()
      })

      it("with platform subdomain", () => {
        const o = { ...feed, identifier: "blog" }
        testGraphQLProperty(
          fields,
          "feed_url",
          new graphql.GraphQLNonNull(graphql.GraphQLString),
          o,
          `https://${o.identifier}.${context.hosts.platform}/rss`
        )()
      })
    })

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
    })

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
        "http://" + o.parent_feed
      )()
    })
  })

  describe("should include and resolve a required string website_url", () => {
    it("without website", () => {
      const feed = {
        ...obj,
        external: false,
        identifier: "toto",
        link: null
      }

      it("without custom domain", () => {
        testGraphQLProperty(
          fields,
          "website_url",
          new graphql.GraphQLNonNull(graphql.GraphQLString),
          feed,
          `http://${feed.identifier}.${context.hosts.podcasts}/`
        )()
      })

      it("with custom domain", () => {
        const o = { ...feed, custom_domain: "monpodcast.fr" }
        testGraphQLProperty(
          fields,
          "website_url",
          new graphql.GraphQLNonNull(graphql.GraphQLString),
          o,
          `http://${o.custom_domain}/`
        )()
      })

      it("with platform subdomain", () => {
        const o = { ...feed, identifier: "blog" }
        testGraphQLProperty(
          fields,
          "website_url",
          new graphql.GraphQLNonNull(graphql.GraphQLString),
          o,
          `http://${o.identifier}.${context.hosts.platform}/`
        )()
      })
    })

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
    })

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
        "http://" + o.link
      )()
    })
  })

  it(
    "should include and resolve a required boolean external",
    testGraphQLProperty(
      fields,
      "external",
      new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
      obj,
      false
    )
  )

  it(
    "should include and resolve a required boolean disabled",
    testGraphQLProperty(
      fields,
      "disabled",
      new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
      obj,
      false
    )
  )

  it(
    "should include and resolve a required boolean explicit",
    testGraphQLProperty(
      fields,
      "explicit",
      new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
      obj,
      true
    )
  )

  it(
    "should include and resolve a required string array tags",
    testGraphQLProperty(
      fields,
      "tags",
      new graphql.GraphQLList(
        new graphql.GraphQLNonNull(graphql.GraphQLString)
      ),
      obj,
      ["test", "tags", "lol"]
    )
  )

  it(
    "should include and resolve a required boolean itunes_block",
    testGraphQLProperty(
      fields,
      "itunes_block",
      new graphql.GraphQLNonNull(graphql.GraphQLBoolean),
      obj,
      false
    )
  )

  it(
    "should include and resolve a string itunes_category",
    testGraphQLProperty(
      fields,
      "itunes_category",
      graphql.GraphQLString,
      obj,
      obj.itunes_category
    )
  )

  it(
    "should include and resolve a string feed_redirect_url",
    testGraphQLProperty(
      fields,
      "feed_redirect_url",
      graphql.GraphQLString,
      obj,
      obj.feed_redirect_url
    )
  )

  it("should include and resolve a null feed_redirect_url", () => {
    obj.feed_redirect_url = ""
    return testGraphQLProperty(
      fields,
      "feed_redirect_url",
      graphql.GraphQLString,
      obj,
      null
    )()
  })

  it(
    "should include and resolve a string web_redirect_url",
    testGraphQLProperty(
      fields,
      "web_redirect_url",
      graphql.GraphQLString,
      obj,
      obj.web_redirect_url
    )
  )

  it("should include and resolve a null web_redirect_url", () => {
    obj.web_redirect_url = ""
    return testGraphQLProperty(
      fields,
      "web_redirect_url",
      graphql.GraphQLString,
      obj,
      null
    )()
  })

  it(
    "should include a required list of PodcastItems",
    testGraphQLProperty(
      fields,
      "items",
      new graphql.GraphQLNonNull(
        new graphql.GraphQLList(schema.getType("PodcastItem"))
      )
    )
  )

  describe("should resolve a required list of PodcastItems", () => {
    let ItemMock
    let PodcastResolvers

    beforeEach(() => {
      ItemMock = sinon.mock(Item)
      PodcastResolvers = proxyquire(
        "../../../../src/schema/types/resolvers/podcast",
        {
          Item
        }
      ).default
    })

    it("should reject the promise when database has an error", () => {
      const err_msg = "Error occured (simulated at " + +new Date() / 1000 + ")"

      ItemMock.expects("find")
        .chain("exec")
        .yields(err_msg, null)

      const items = PodcastResolvers.items(obj)

      expect(items).to.be.a("promise")
      ItemMock.verify()

      return expect(items).to.be.eventually.rejectedWith(err_msg)
    })

    it("should filter out null values from db", () => {
      ItemMock.expects("find")
        .chain("exec")
        .yields(undefined, [null, { id: "item1" }, { id: "item2" }])

      const items = PodcastResolvers.items(obj)

      expect(items).to.be.a("promise")
      ItemMock.verify()

      return expect(items).to.eventually.deep.equals([
        {
          id: "item1",
          feed: obj
        },
        {
          id: "item2",
          feed: obj
        }
      ])
    })

    it("should resolve the promise when everything works", () => {
      ItemMock.expects("find")
        .chain("exec")
        .yields(undefined, [{ id: "item1" }, { id: "item2" }])

      const items = PodcastResolvers.items(obj)

      expect(items).to.be.a("promise")
      ItemMock.verify()

      return expect(items).to.eventually.deep.equals([
        {
          id: "item1",
          feed: obj
        },
        {
          id: "item2",
          feed: obj
        }
      ])
    })

    afterEach(() => {
      ItemMock.restore()
    })
  })
})
