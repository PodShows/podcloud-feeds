const Cover = `
type Cover {
  width: Int
  height: Int
  sha1: String
  squared: Boolean
  dominant_color: String
  url: String!
  small_url: String!
  medium_url: String!
  big_url: String!
}
`

export default () => [Cover]
