import Mongoose from 'mongoose';
import rp from 'request-promise';
import _ from 'lodash';
import config from 'config';

const ObjectId = Mongoose.Schema.Types.ObjectId;

const mongo = Mongoose.connect(config.get("mongodb"), {
    promiseLibrary: rp,
    useMongoClient: true,
}, (err) => {
    if(err){
        console.error('Could not connect to MongoDB on port 27017');
    }    
});

const FeedSchema = new Mongoose.Schema({
    _id: ObjectId,
    title: String,
    catchline: String,
    description: String,
    copyright: String,
    cover_filename: String,
    identifier: String,
    language: String,
    contact_email: String,
    author: String,
    explicit: Boolean,
    tags: String,
    _slugs: [String],
    parent_feed: String,
    external: Boolean,
    created_at: Date,
    updated_at: Date,
    ordering: String,
    block_itunes: Boolean,
    itunes_category: String,
    disabled: Boolean,
    feed_redirect_url: String,
    web_redirect_url: String
})

const Feed = Mongoose.model('feeds', FeedSchema);

const EnclosureUrlSchema = new Mongoose.Schema({
    path: String
});

const EnclosureSchema = new Mongoose.Schema({
    duration_in_seconds: Number,
    length: String,
    mime_type: String,
    meta_url: EnclosureUrlSchema
});

const ItemSchema = new Mongoose.Schema({
    _id: ObjectId,
    title: String,
    explicit: Boolean,
    author: String,
    link: String,
    _slugs: [String],
    content: String,
    published_at: Date,
    enclosure: EnclosureSchema
});

const Item = Mongoose.model('items', ItemSchema);

export { Feed, Item };
