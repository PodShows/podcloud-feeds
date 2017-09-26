import Mongoose from 'mongoose';
import rp from 'request-promise';
import _ from 'lodash';

const ObjectId = Mongoose.Schema.Types.ObjectId;

const mongo = Mongoose.connect('mongodb://localhost/podcloud', {
    promiseLibrary: rp,
    useMongoClient: true,
}, (err) => {
  if(err){
    console.error('Could not connect to MongoDB on port 27017');
  }    
});

const FeedSchema = Mongoose.Schema({
  _id: ObjectId,
  title: String,
  catchline: String,
  description: String,
  identifier: String,
  parent_feed: String,
  external: Boolean,
  created_at: Date  
})

const Feed = Mongoose.model('feeds', FeedSchema);

export { Feed };
