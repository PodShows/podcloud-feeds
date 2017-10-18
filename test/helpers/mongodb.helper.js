import mongo_connect from "~/connectors/connection.js"
import config from "config"

export default function connect() {
	return mongo_connect(config.get("mongodb"));
}