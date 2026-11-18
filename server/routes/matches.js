import { Router } from 'express';
import { handleGetMatches } from '../controllers/discoverController.js';

const router = Router();
router.get('/', handleGetMatches);

export default router;
