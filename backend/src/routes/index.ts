import { Router } from 'express';
import rutasProductos from '../modules/productos/routes';
import rutasVentas from '../modules/ventas/routes';
import rutasReportes from '../modules/reportes/routes';

const router = Router();

router.use('/productos', rutasProductos);
router.use('/ventas', rutasVentas);
router.use('/reportes', rutasReportes);

export default router;
