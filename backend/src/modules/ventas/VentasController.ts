// archivo: backend/src/modules/ventas/VentasController.ts

import { Request, Response } from 'express';
import { VentaService } from './services/VentaService';

export class VentasController {
    private service: VentaService;

    constructor() {
        this.service = new VentaService();
    }

    crearVenta = async (req: Request, res: Response) => {
        const { venta, detalles } = req.body;

        if (!venta || !detalles || detalles.length === 0) {
            throw new Error('Datos de venta incompletos');
        }

        // Asignar usuario dummy si no viene (para pruebas)
        if (!venta.id_usuario) venta.id_usuario = 1;

        const resultado = await this.service.procesarVenta(venta, detalles);
        res.status(201).json({ success: true, data: resultado });
    }
}