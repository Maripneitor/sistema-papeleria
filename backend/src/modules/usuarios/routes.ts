import { Router } from 'express';
import { UsuariosController } from './UsuariosController';

const router = Router();
const controller = new UsuariosController();

router.get('/', controller.listar);
router.post('/', controller.crear);

export default router;
