import { Router } from 'express';
import { ProveedoresController } from './ProveedoresController';

const router = Router();
const controller = new ProveedoresController();

router.get('/', controller.listar);
router.post('/', controller.crear);

export default router;
