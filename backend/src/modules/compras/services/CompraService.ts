// archivo: backend/src/modules/compras/services/CompraService.ts

import pool from '../../../config/db';
import { CompraRepository } from '../repositories/CompraRepository';
import { InventarioRepository } from '../../inventario/repositories/InventarioRepository';
import { Compra, CompraDetalle } from '../../shared/types';

export class CompraService {
    private compraRepo = new CompraRepository();
    private invRepo = new InventarioRepository();

    async procesarCompra(compra: Compra, detalles: CompraDetalle[]) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            // Usamos idCompra (camelCase)
            const idCompra = await this.compraRepo.crearCompra(compra, conn);
            
            for (const item of detalles) {
                item.id_compra = idCompra;
                await this.compraRepo.crearDetalle(item, conn);
                // Sumar stock (positivo)
                await this.invRepo.actualizarStock(item.id_producto, item.cantidad, conn);
            }
            await conn.commit();
            
            // CORRECCIÓN: Retornamos con el nombre correcto de la propiedad
            return { id_compra: idCompra }; 
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}