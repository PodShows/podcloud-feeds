import mongo_connect from "~/connectors/connection.js"
import config from "config"

mongo_connect(config.get("mongodb"));