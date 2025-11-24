import { Request, Response } from 'express';
import { ReportesRepository } from './ReportesRepository';

export class ReportesController {
    private repo = new ReportesRepository();
    obtenerDashboard = async (req: Request, res: Response) => {
        const [topProductos, ventasSemana, kpis] = await Promise.all([
            this.repo.obtenerTopProductos(),
            this.repo.obtenerVentasSemana(),
            this.repo.obtenerKPIs()
        ]);
        res.json({ success: true, data: { kpis, topProductos, ventasSemana } });
    }
}