import { BigInt } from "~/schema/scalars";

const Enclosure = `
type Enclosure {
  duration: Int!
  size: BigInt!
  type: String!
  url: String!  
}
`;

export default () => [Enclosure, BigInt.schema];
