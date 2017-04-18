import express from 'express';
import cors from 'cors';

import graphQLRoutes from './graphql';

const router = express.Router();

router.use(cors());

// GraphQL Server
router.use('/graphql', graphQLRoutes);

export default router;
