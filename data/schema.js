const typeDefinitions = `
scalar Date

type Feed {
  title: String!
  catchline: String!
  description: String!
  created_at: String!
  internal: Boolean!
  external: Boolean!
  url: String!
}

type RootQuery {
  feeds: [Feed]
}

schema {
  query: RootQuery
}
`;

export default [typeDefinitions];
