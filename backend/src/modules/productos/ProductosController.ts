import { Request, Response } from 'express';
import { ProductoService } from './services/ProductoService';

export class ProductosController {
    private service: ProductoService;

    constructor() {
        this.service = new ProductoService();
    }

    // GET /api/productos
    obtenerCatalogo = async (req: Request, res: Response) => {
        try {
            const productos = await this.service.obtenerCatalogo();
            res.json({ success: true, data: productos });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // POST /api/productos
    crearProducto = async (req: Request, res: Response) => {
        try {
            const producto = await this.service.registrarProducto(req.body);
            res.status(201).json({ success: true, data: producto, message: 'Producto creado' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
