import { Router } from 'express';
import { ReportesController } from './ReportesController';

const router = Router();
const controller = new ReportesController();

router.get('/dashboard', controller.obtenerDashboard);

export default router;
