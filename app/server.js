import express from 'express';
import { PORT } from './config';
import connectDb from './database/connectDb';
import { prepareDir } from './lib/google/place/photo';
import { statisticalJob } from './lib/jobs';
import { connect } from './lib/render';

const app = express();

function onConnected() {
  const mainRouter = require('./routes').default; // eslint-disable-line global-require
  app.use(mainRouter);

  app.listen(PORT, () => {
    console.log('API Server is running at localhost:%s', PORT);
  });

}

connect('45.32.216.6', 6969);
connectDb(onConnected);
prepareDir();
statisticalJob();

