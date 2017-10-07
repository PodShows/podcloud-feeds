import RootQuery from './rootQuery';

const typeDefinitions = `
schema {
  query: RootQuery
}
`;

export default [RootQuery, typeDefinitions];