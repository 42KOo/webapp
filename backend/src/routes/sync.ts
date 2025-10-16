import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { handleSync } from '../controllers/syncController';

const router = Router();

router.post('/', authenticate, handleSync);

export default router;
