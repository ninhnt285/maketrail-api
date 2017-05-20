import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './auth';
import graphQLRoutes from './graphql';

const router = express.Router();

router.use(cors());

// Test URL
router.get('/', (req, res) => {
  res.send('Hello MakeTrail');
});

router.use('/resources', express.static(path.join(__dirname, '../../static')));

// Authentication
router.use(authRoutes);


// GraphQL Server
router.use('/graphql', cors(), graphQLRoutes);

export default router;
