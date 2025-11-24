// archivo: backend/src/modules/productos/ProductosController.ts

import { Request, Response } from 'express';
import { ProductoService } from './services/ProductoService';

export class ProductosController {
    private service: ProductoService;

    constructor() {
        this.service = new ProductoService();
    }

    obtenerCatalogo = async (req: Request, res: Response) => {
        const productos = await this.service.obtenerCatalogo();
        res.json({ success: true, data: productos });
    }

    crearProducto = async (req: Request, res: Response) => {
        const body = req.body;
        // Validación mínima de entrada
        if (!body || Object.keys(body).length === 0) {
            throw new Error('Cuerpo de la petición vacío'); // El middleware lo atrapará
        }

        const nuevoProducto = await this.service.registrarProducto(body);
        res.status(201).json({ success: true, data: nuevoProducto, message: 'Producto creado' });
    }

    actualizarProducto = async (req: Request, res: Response) => {
        const { id } = req.params;
        const resultado = await this.service.actualizarProducto(Number(id), req.body);
        res.json({ success: true, ...resultado });
    }

    eliminarProducto = async (req: Request, res: Response) => {
        const { id } = req.params;
        const resultado = await this.service.eliminarProducto(Number(id));
        res.json({ success: true, ...resultado });
    }
}