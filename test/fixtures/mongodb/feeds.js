import { Types } from "mongoose"
const ObjectId = Types.ObjectId;

var Feeds = [
	{
		_id: ObjectId("000000000000000000000001"),
	    title: "Blog",
	    catchline: "Ceci est un blog",
	    description: "Description du blog",
	    copyright: "Copyright du blog",
	    cover_filename: "pouet.jpeg",
		identifier: "blog", 
	    language: "fr",
	    contact_email: "contact@blog.test",
	    author: "Auteur",
	    explicit: false,
	    tags: "blog,tags,lol",
		_slugs:["blog", "weblog"],
	    parent_feed: "",
	    external: false,
	    created_at: new Date(),
	    updated_at: new Date(),
	    ordering: "desc",
	    block_itunes: false,
	    itunes_category: "podcasting",
	    disabled: false,
	    feed_redirect_url: "",
	    web_redirect_url: ""
	},
	{
		_id: ObjectId("000000000000000000000002"),
	    title: "Une fiction",
	    catchline: "Fictionite",
	    description: "Ceci est une fiction",
	    copyright: "coucou",
	    cover_filename: "fiction.png",
	    identifier: "fiction",
	    language: "fr",
	    contact_email: "",
	    author: "",
	    explicit: true,
	    tags: "explicit,fiction,lol",
	    _slugs: ["fiction"],
	    parent_feed: "http://parent.test/feed",
	    external: false,
	    created_at: new Date(),
	    updated_at: new Date(),
	    ordering: "asc",
	    block_itunes: false,
	    itunes_category: "Art",
	    disabled: false,
	    feed_redirect_url: "",
	    web_redirect_url: ""
	}
]

export default Feeds