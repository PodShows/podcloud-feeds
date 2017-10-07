const typeDefsFixtures = `
type HelloWorld {
  message: String!
}

type RootQuery {
  greetings: HelloWorld
}

schema {
  query: RootQuery
}
`;

export default [typeDefsFixtures];