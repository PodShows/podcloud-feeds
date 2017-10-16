import { Types } from "mongoose"
const ObjectId = Types.ObjectId;

var Feeds = [
	{
		_id: ObjectId("000000000000000000000001"),
		identifier: "podcast", 
		_slugs:["podcast", "other-podcast"]
	}
]

export default Feeds