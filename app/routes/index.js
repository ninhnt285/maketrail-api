import express from 'express';
import cors from 'cors';

import authRoutes from './auth';
import graphQLRoutes from './graphql';

const router = express.Router();

router.use(cors())

// Test URL
router.get('/', (req, res) => {
  res.send('Hello MakeTrail');
})

// Authentication
router.use(authRoutes);


// GraphQL Server
router.use('/graphql', graphQLRoutes);

export default router;
