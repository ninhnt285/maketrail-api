import express from 'express';
import http from 'http';
import { PORT } from './config';
import connectDb from './database/connectDb';
import { prepareDir } from './lib/google/place/photo';
import { statisticalJob } from './lib/jobs';
import { createRenderServer } from './lib/render';
import { createChatServer } from './lib/chat';

const app = express();
const server = http.createServer(app);

function onConnected() {
  const mainRouter = require('./routes').default; // eslint-disable-line global-require
  app.use(mainRouter);

  server.listen(PORT, () => {
    console.log('API Server is running at localhost:%s', PORT);
  });

}

createRenderServer();
createChatServer(server);
connectDb(onConnected);
prepareDir();
statisticalJob();

