import { Router } from 'express';
import { ProveedoresController } from './ProveedoresController';
const router = Router();
const ctrl = new ProveedoresController();
router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
export default router;