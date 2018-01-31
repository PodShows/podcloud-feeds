import { RootQuery } from "./queries/typeDefs"

const typeDefinitions = [
  RootQuery,
  `
schema {
  query: RootQuery
}
`
]

export { typeDefinitions }

export default typeDefinitions
