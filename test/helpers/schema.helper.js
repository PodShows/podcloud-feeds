import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from '~/schema'

export function buildSchema() {
	return makeExecutableSchema({
		typeDefs,
		resolvers,
		resolverValidationOptions: { 
			requireResolversForAllFields: true 
		}
	})
}