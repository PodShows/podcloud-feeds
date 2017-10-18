import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, Resolvers } from '~/schema'

export function buildSchema() {
	console.log(Resolvers.RootQuery.podcasts)
	return makeExecutableSchema({
		typeDefs,
		Resolvers,
		resolverValidationOptions: { 
			requireResolversForAllFields: true 
		}
	})
}