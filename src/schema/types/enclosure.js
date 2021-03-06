import { BigInt } from "~/schema/scalars";
import Cover from "~/schema/types/cover";

const Enclosure = `
type Enclosure {
  duration: Int!
  size: BigInt!
  type: String!
  url(purpose: String): String!
  cover: Cover!
}
`;

export default () => [Enclosure, BigInt.schema, Cover];
