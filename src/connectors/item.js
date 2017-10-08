import Mongoose from 'mongoose';

const ObjectId = Mongoose.Schema.Types.ObjectId;

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

export default Item;