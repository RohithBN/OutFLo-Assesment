import express from 'express';
import { generatePersonalizedMessage } from '../controllers/messageController';

const router = express.Router();

router.post('/personalized-message', generatePersonalizedMessage);

export default router;
