import * as GraphQLBigInt from "graphql-bigint"

const BigInt = {
  schema: `scalar BigInt`,
  resolve: GraphQLBigInt.default
}

export default BigInt
