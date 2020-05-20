const Cover = `
type Cover {
  width: Int
  height: Int
  sha1: String
  squared: Boolean
  dominant_color: String
  url: String!
}
`

export default () => [Cover]
