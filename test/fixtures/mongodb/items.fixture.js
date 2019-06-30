import { Types } from "mongoose"
const ObjectId = Types.ObjectId
const NOW = new Date()

const items = [
  {
    _id: ObjectId("000000000000000000000011"),
    feed_id: ObjectId("000000000000000000000001"),
    title: "Blog post",
    explicit: false,
    author: "Blog",
    link: "",
    status: "published",
    private: false,
    _slugs: ["blog-post"],
    content: "Ceci est un post de blog",
    episode_type: "full",
    season: 1,
    episode: 4,
    published_at: new Date(+NOW - 3 * 24 * 3600 * 1000)
  },
  {
    _id: ObjectId("000000000000000000000012"),
    feed_id: ObjectId("000000000000000000000001"),
    title: "Blog post 2",
    explicit: false,
    author: "Blogger",
    link: "",
    status: "published",
    private: false,
    _slugs: ["blog-post-2"],
    content: "Ceci est un post de blog, le deuxieme",
    episode_type: "teaser",
    season: null,
    episode: 5,
    published_at: NOW
  },
  {
    _id: ObjectId("000000000000000000000013"),
    feed_id: ObjectId("000000000000000000000001"),
    title: "Blog post dans le turfu",
    explicit: false,
    author: "Futur",
    link: "",
    status: "published",
    private: false,
    _slugs: ["blog-post-turfu"],
    content: "Ceci est un post de blog mais pas publié",
    episode_type: "bonus",
    season: 5,
    published_at: new Date(+NOW + 3 * 24 * 3600 * 1000)
  },
  {
    _id: ObjectId("000000000000000000000014"),
    feed_id: ObjectId("000000000000000000000001"),
    title: "Blog post dans le passé mais cassé",
    explicit: false,
    author: "Failed",
    link: "",
    status: "failed",
    private: false,
    _slugs: ["blog-post-past-pété"],
    content: "Ceci est un post de blog mais pété",
    published_at: new Date(+NOW - 3 * 24 * 3600 * 1000)
  },
  {
    _id: ObjectId("000000000000000000000015"),
    feed_id: ObjectId("000000000000000000000001"),
    title: "Blog post dans le passé mais privé",
    explicit: false,
    author: "privé",
    link: "",
    status: "published",
    private: true,
    _slugs: ["blog-post-past-private"],
    content: "Ceci est un post de blog mais private",
    published_at: new Date(+NOW - 3 * 24 * 3600 * 1000)
  },
  {
    _id: ObjectId("000000000000000000000016"),
    feed_id: ObjectId("000000000000000000000002"),
    title: "Episode 1",
    explicit: false,
    author: "Pouet",
    link: "",
    status: "published",
    private: false,
    _slugs: ["episode-1"],
    content: "Ceci est un episode",
    published_at: new Date(+NOW - 15 * 24 * 3600 * 1000)
  },
  {
    _id: ObjectId("000000000000000000000017"),
    feed_id: ObjectId("000000000000000000000002"),
    title: "Episode 2",
    explicit: false,
    author: "Author",
    link: "",
    status: "published",
    private: false,
    _slugs: ["episode-2"],
    content: "Ceci est l'épisode 2",
    published_at: NOW
  }
]

export { items }
export default items
