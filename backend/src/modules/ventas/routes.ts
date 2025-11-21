import { Router } from 'express';
import { VentasController } from './VentasController';

const router = Router();
const controller = new VentasController();

router.post('/', controller.procesarVenta);

export default router;
