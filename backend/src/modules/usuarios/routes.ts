import { Router } from 'express';
import { UsuariosController } from './UsuariosController';
const router = Router();
const ctrl = new UsuariosController();
router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
export default router;