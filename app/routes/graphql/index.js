import express from 'express';
import graphqlHTTP from 'express-graphql';
import multer from 'multer';

import schema from '../../graphql';

const router = express.Router();

router.use(multer({ storage: multer.memoryStorage() }).single('file'));

router.use(graphqlHTTP(req => ({
  schema,
  rootValue: { user: req.user },
  graphiql: true
})));

export default router;
