import { Router } from 'express';
import { ReportesController } from './ReportesController';
const router = Router();
const ctrl = new ReportesController();
router.get('/dashboard', ctrl.obtenerDashboard);
export default router;