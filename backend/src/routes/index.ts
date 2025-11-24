// archivo: backend/src/routes/index.ts

import { Router } from 'express';
import productosRouter from '../modules/productos/routes';
import ventasRouter from '../modules/ventas/routes';
import comprasRouter from '../modules/compras/routes';
import proveedoresRouter from '../modules/proveedores/routes';
import usuariosRouter from '../modules/usuarios/routes';
import reportesRouter from '../modules/reportes/routes';

const router = Router();

router.use('/productos', productosRouter);
router.use('/ventas', ventasRouter);
router.use('/compras', comprasRouter);
router.use('/proveedores', proveedoresRouter);
router.use('/usuarios', usuariosRouter);
router.use('/reportes', reportesRouter);

export default router;