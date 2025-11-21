import { Router } from 'express';
import { ComprasController } from './ComprasController';

const router = Router();
const controller = new ComprasController();

router.post('/', controller.procesarCompra);

export default router;
