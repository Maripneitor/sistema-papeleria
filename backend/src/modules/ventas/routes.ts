// archivo: backend/src/modules/ventas/routes.ts

import { Router } from 'express';
import { VentasController } from './VentasController';

const router = Router();
const controller = new VentasController();

router.post('/', controller.crearVenta);

export default router;