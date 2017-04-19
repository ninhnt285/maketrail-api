import express from 'express';
import cookiesParser from 'cookie-parser';

import verifyToken from './verifyToken';

const router = express.Router();

router.use(cookiesParser(), verifyToken);

export default router;
