import { Request, Response } from 'express';
import { ProveedorService } from './services/ProveedorService';

export class ProveedoresController {
    private service: ProveedorService;

    constructor() {
        this.service = new ProveedorService();
    }

    listar = async (req: Request, res: Response) => {
        try {
            const lista = await this.service.obtenerLista();
            res.json({ success: true, data: lista });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    crear = async (req: Request, res: Response) => {
        try {
            const nuevo = await this.service.registrar(req.body);
            res.status(201).json({ success: true, data: nuevo, message: 'Proveedor registrado' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
