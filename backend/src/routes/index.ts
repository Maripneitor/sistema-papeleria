import { Router } from 'express';
import rutasProductos from '../modules/productos/routes';
import rutasVentas from '../modules/ventas/routes';
import rutasReportes from '../modules/reportes/routes';
import rutasProveedores from '../modules/proveedores/routes';
import rutasCompras from '../modules/compras/routes';
import rutasUsuarios from '../modules/usuarios/routes';

const router = Router();

router.use('/productos', rutasProductos);
router.use('/ventas', rutasVentas);
router.use('/reportes', rutasReportes);
router.use('/proveedores', rutasProveedores);
router.use('/compras', rutasCompras);
router.use('/usuarios', rutasUsuarios);

export default router;
