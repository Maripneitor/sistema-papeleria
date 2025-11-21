import { Request, Response } from 'express';
import { CompraService } from './services/CompraService';

export class ComprasController {
    private service: CompraService;

    constructor() {
        this.service = new CompraService();
    }

    procesarCompra = async (req: Request, res: Response) => {
        try {
            const { compra, detalles } = req.body;
            if (!compra || !detalles || detalles.length === 0) {
                return res.status(400).json({ success: false, message: 'Faltan datos de compra' });
            }

            const resultado = await this.service.procesarCompra(compra, detalles);
            res.status(201).json(resultado);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
