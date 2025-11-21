import { Router } from 'express';
import rutasProductos from '../modules/productos/routes';
import rutasVentas from '../modules/ventas/routes';

const router = Router();

// Definir prefijos
router.use('/productos', rutasProductos);
router.use('/ventas', rutasVentas);

export default router;
