import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { createShipment, listShipments, updateShipment } from '../controllers/shipmentController';

const router = Router();

router.post('/', authenticate, createShipment);
router.get('/', authenticate, listShipments);
router.put('/:id', authenticate, updateShipment);

export default router;
