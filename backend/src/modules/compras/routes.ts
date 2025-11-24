import { Router } from 'express';
import { ComprasController } from './ComprasController';
const router = Router();
const ctrl = new ComprasController();
router.post('/', ctrl.crear);
export default router;