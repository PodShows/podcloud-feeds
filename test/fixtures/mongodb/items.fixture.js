import { Types } from "mongoose"
const ObjectId = Types.ObjectId;
const NOW = new Date();

const items = [
	{
		_id: ObjectId("000000000000000000000011"),
		feed_id: ObjectId("000000000000000000000001"),
	    title: "Blog post",
	    explicit: false,
	    author: "Blog",
	    link: "",
	    _slugs: ["blog-post"],
		content: "Ceci est un post de blog",
		published_at: new Date((+NOW) - (3 * 24 * 3600 * 1000)),
	},
	{
		_id: ObjectId("000000000000000000000012"),
		feed_id: ObjectId("000000000000000000000001"),
	    title: "Blog post 2",
	    explicit: false,
	    author: "Blogger",
	    link: "",
	    _slugs: ["blog-post-2"],
		content: "Ceci est un post de blog, le deuxieme",
		published_at: NOW
	},
	{
		_id: ObjectId("000000000000000000000013"),
		feed_id: ObjectId("000000000000000000000001"),
	    title: "Blog post dans le turfu",
	    explicit: false,
	    author: "Futur",
	    link: "",
	    _slugs: ["blog-post-turfu"],
		content: "Ceci est un post de blog mais pas publié",
		published_at: new Date((+NOW) + (3 * 24 * 3600 * 1000)),
	},
	{
		_id: ObjectId("000000000000000000000014"),
		feed_id: ObjectId("000000000000000000000002"),
	    title: "Episode 1",
	    explicit: false,
	    author: "Pouet",
	    link: "",
	    _slugs: ["episode-1"],
		content: "Ceci est un episode",
		published_at: new Date((+NOW) - (15 * 24 * 3600 * 1000)),
	},
	{
		_id: ObjectId("000000000000000000000015"),
		feed_id: ObjectId("000000000000000000000002"),
	    title: "Episode 2",
	    explicit: false,
	    author: "Author",
	    link: "",
	    _slugs: ["episode-2"],
		content: "Ceci est l'épisode 2",
		published_at: NOW,
	}
]

export { items }
export default items