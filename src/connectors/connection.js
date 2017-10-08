import Mongoose from 'mongoose';
import rp from 'request-promise';

function mongo_connect(conn_str) {
	const mongo = Mongoose.connect(conn_str, {
	    promiseLibrary: rp,
	    useMongoClient: true,
	}, (err) => {
	    if(err){
	        console.error('Could not connect to MongoDB on port 27017');
	    }    
	});

	return mongo;
}

export default mongo_connect;