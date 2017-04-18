import express from 'express';
import cors from 'cors';

import graphQLRoutes from './graphql';

const router = express.Router();

router.use(cors())

// Test URL
router.get('/', (req, res) => {
  res.send('Hello MakeTrail');
});

// GraphQL Server
router.use('/graphql', graphQLRoutes);

export default router;
