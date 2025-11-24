import { Request, Response } from 'express';
import { CompraService } from './services/CompraService';

export class ComprasController {
    private service = new CompraService();
    crear = async (req: Request, res: Response) => {
        const { compra, detalles } = req.body;
        const result = await this.service.procesarCompra(compra, detalles);
        res.status(201).json({ success: true, data: result });
    }
}