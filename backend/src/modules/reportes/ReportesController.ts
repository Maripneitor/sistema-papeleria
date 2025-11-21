import { Request, Response } from 'express';
import { ReportesRepository } from './ReportesRepository';

export class ReportesController {
    private repo: ReportesRepository;

    constructor() {
        this.repo = new ReportesRepository();
    }

    obtenerDashboard = async (req: Request, res: Response) => {
        try {
            const topProductos = await this.repo.obtenerTopProductos();
            const ventasSemana = await this.repo.obtenerVentasSemana();
            
            res.json({
                success: true,
                data: {
                    topProductos,
                    ventasSemana
                }
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
