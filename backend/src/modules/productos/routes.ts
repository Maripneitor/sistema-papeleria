// archivo: backend/src/modules/productos/routes.ts

import { Router } from 'express';
import { ProductosController } from './ProductosController';

const router = Router();
const controller = new ProductosController();

router.get('/', controller.obtenerCatalogo);
router.post('/', controller.crearProducto);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

export default router;