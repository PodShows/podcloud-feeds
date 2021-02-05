import { expect } from "chai";
import sinon from "sinon";

import * as graphql from "graphql";
import { buildSchema } from "#/helpers/schema.helper";
import { context } from "#/helpers/server.helper";
import BigInt from "graphql-bigint";

describe("Enclosure Graph Object", () => {
  const schema = buildSchema();
  const enclosureFields = schema.getType("Enclosure").getFields();

  const enclosureObject = {
    item: {
      id: "this_is_my_id",
      _slugs: ["toto", "tata"],
      feed: { identifier: "blog-de-toto" },
      updated_at: new Date(1337 * 1000)
    },
    duration_in_seconds: 600,
    length: "123521",
    sha256: "blabla",
    media_type: null,
    mime_type: "audio/mpeg+test",
    filename: "afile.ext",
    meta_url: {
      path: "http://anurl.test/afile.mp3"
    }
  };

  it("should include a required int duration", () => {
    expect(enclosureFields).to.have.property("duration");
    expect(enclosureFields.duration.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLInt)
    );
  });

  it("should resolve duration", () => {
    enclosureObject.duration_in_seconds = 600;
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(600);
    enclosureObject.duration_in_seconds = -1;
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(0);
    enclosureObject.duration_in_seconds = null;
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(0);
    delete enclosureObject.duration_in_seconds;
    expect(enclosureFields.duration.resolve(enclosureObject)).to.equals(0);
  });

  it("should include a required bigint size", () => {
    expect(enclosureFields).to.have.property("size");
    expect(enclosureFields.size.type).to.deep.equals(
      new graphql.GraphQLNonNull(BigInt)
    );
  });

  it("should resolve size", () => {
    expect(enclosureFields.size.resolve(enclosureObject)).to.equals(123521);
    const five_tera = 5 * 1024 * 1024 * 1024 * 1024 * 1024;
    expect(
      enclosureFields.size.resolve({
        ...enclosureObject,
        length: "" + five_tera /* 5 To */
      })
    ).to.equals(five_tera);
  });

  it("should include a required string type", () => {
    expect(enclosureFields).to.have.property("type");
    expect(enclosureFields.type.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    );
  });

  it("should resolve mpeg type with mp3 media type", () => {
    expect(
      enclosureFields.type.resolve({
        ...enclosureObject,
        media_type: "mp3"
      })
    ).to.equals("audio/mpeg");
  });

  it("should resolve stored mime-type with unknown media type", () => {
    expect(
      enclosureFields.type.resolve({
        ...enclosureObject,
        media_type: "unknown"
      })
    ).to.equals(enclosureObject.mime_type);
  });

  it("should resolve stored mime-type when media_type is null or undefined", () => {
    expect(enclosureFields.type.resolve(enclosureObject)).to.equals(
      "audio/mpeg+test"
    );
  });

  it("should resolve default mime-type with unknown media type and no stored mime-type", () => {
    expect(
      enclosureFields.type.resolve({
        ...enclosureObject,
        media_type: "unknown",
        mime_type: null
      })
    ).to.equals("application/octet-stream");
  });

  it("should include a required string url", () => {
    expect(enclosureFields).to.have.property("url");
    expect(enclosureFields.url.type).to.deep.equals(
      new graphql.GraphQLNonNull(graphql.GraphQLString)
    );
  });

  it("should resolve url with default purpose", () => {
    expect(enclosureFields.url.resolve(enclosureObject, {}, context)).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure.blabla.ext?p=dl"
    );
  });

  it("should resolve url with custom purpose", () => {
    expect(
      enclosureFields.url.resolve(enclosureObject, { purpose: "f" }, context)
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure.blabla.ext?p=f"
    );
  });

  it("should resolve url without preview", () => {
    expect(enclosureFields.url.resolve(enclosureObject, {}, context)).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure.blabla" +
        ".ext?p=dl"
    );

    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          item: { ...enclosureObject.item, preview: false }
        },
        {},
        context
      )
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure.blabla" +
        ".ext?p=dl"
    );
  });

  it("should resolve url with preview", () => {
    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          item: { ...enclosureObject.item, preview: true }
        },
        {},
        context
      )
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure.blabla" +
        ".ext?p=dl&preview=" +
        enclosureObject.item.id
    );
  });

  it("should resolve url with correct media_type", () => {
    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          media_type: "pouet"
        },
        {},
        context
      )
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure." +
        "blabla" +
        ".pouet?p=dl"
    );
  });

  it("should resolve url using filename ext with incorrect media_type", () => {
    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          media_type: null
        },
        {},
        context
      )
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure." +
        "blabla" +
        ".ext?p=dl"
    );
  });

  it("should resolve url using default ext with incorrect media_type and filename", () => {
    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          media_type: null,
          filename: null
        },
        {},
        context
      )
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure." +
        "blabla" +
        ".mp3?p=dl"
    );
  });

  it("should resolve url with url_prefix if present", () => {
    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          media_type: null,
          filename: null,
          item: {
            ...enclosureObject.item,
            feed: {
              ...enclosureObject.item.feed,
              url_prefix: "https://michel.stats/"
            }
          }
        },
        {},
        context
      )
    ).to.equals(
      "https://michel.stats/" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure." +
        "blabla" +
        ".mp3?p=dl"
    );
  });

  it("should resolve url without sha256", () => {
    expect(
      enclosureFields.url.resolve(
        {
          ...enclosureObject,
          sha256: null
        },
        {},
        context
      )
    ).to.equals(
      "https://" +
        context.hosts.stats +
        "/blog-de-toto/tata/enclosure." +
        // this is meta_url.path sha256
        "d281e6f02163d971e1218a178ad09fbf09deb41d8e9aaed19ff1a440674221b2" +
        ".ext?p=dl"
    );
  });
});
