import { Router } from 'express';
import { handleGetFeed } from '../controllers/discoverController.js';

const router = Router();
router.get('/', handleGetFeed);

export default router;
