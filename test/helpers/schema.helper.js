import { expect } from "chai"
import * as graphql from "graphql"

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

export function testGraphQLProperty(fields, property, type, obj, expectedResolve) {
	return function() {
		expect(fields).to.have.property(property);
		expect(fields[property].type).to.deep.equals(type);
		expect(fields[property].resolve(obj)).to.equals(expectedResolve);
	}
}