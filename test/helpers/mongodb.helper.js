import loadFixture from 'mongoose-fixture-loader'
import config from "config"

import mongo_connect from "~/connectors/connection.js"

import { Feed } from "~/connectors"
import feeds from "#/fixtures/mongodb/feeds.fixture"

import { Item } from "~/connectors"
import items from "#/fixtures/mongodb/items.fixture"

export function connect() {
	return mongo_connect(config.get("mongodb"));
}

export function tearDown(done) {
	Feed.remove({})
		.then(() => {
			return Item.remove({})
		})
		.then(() => { done() }, done);
}

export function setup(done) {
	connect()
	loadFixture(Feed, feeds)
		.then(() => {
			return loadFixture(Item, items)
		})
		.then(() => { done() }, done);
}

export default {
	connect,
	setup,
	tearDown
}