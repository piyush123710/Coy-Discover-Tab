import { Router } from 'express';
import { handlePostSwipe } from '../controllers/discoverController.js';

const router = Router();
router.post('/', handlePostSwipe);

export default router;
