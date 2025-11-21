import { Request, Response } from 'express';
import { VentaService } from './services/VentaService';

export class VentasController {
    private service: VentaService;

    constructor() {
        this.service = new VentaService();
    }

    // POST /api/ventas
    procesarVenta = async (req: Request, res: Response) => {
        try {
            const { venta, detalles } = req.body;
            
            if (!venta || !detalles || detalles.length === 0) {
                return res.status(400).json({ success: false, message: 'Datos de venta incompletos' });
            }

            // Asignar usuario por defecto si no viene (para pruebas)
            if (!venta.id_usuario) venta.id_usuario = 1;

            const resultado = await this.service.procesarVenta(venta, detalles);
            res.status(201).json(resultado);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
