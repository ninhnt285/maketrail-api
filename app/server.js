import express from 'express';
import { PORT } from './config';
import connectDb from './database/connectDb';

const app = express();

function onConnected() {
  const mainRouter = require('./routes').default; // eslint-disable-line global-require
  app.use(mainRouter);

  app.listen(PORT, () => {
    console.log('API Server is running at localhost:%s', PORT);
  });
}

connectDb(onConnected);
