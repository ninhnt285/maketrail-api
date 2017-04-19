import mongoose from 'mongoose';

function connectDb(cb) {
  mongoose.connect('mongodb://localhost:27017/maketrail');
  mongoose.Promise = global.Promise;
  const conn = mongoose.connection;

  conn.on('error', (error) => {
    console.log('Error while connection!');
    console.log(error);
  });

  conn.on('open', () => {
    console.log('Connected to mongodb!');
    cb && cb(); // eslint-disable-line
  });

  conn.on('disconnected', () => {
    console.log('disconnected to mongodb!');
  });

  conn.on('reconnected', () => {
    console.log('reconnected to mongodb!');
  });
}

export default connectDb;
