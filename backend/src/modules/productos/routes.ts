import { Router } from 'express';
import { ProductosController } from './ProductosController';

const router = Router();
const controller = new ProductosController();

router.get('/', controller.obtenerCatalogo);
router.post('/', controller.crearProducto);

export default router;
