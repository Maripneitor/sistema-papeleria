import pool from '../../../config/db';
import { CompraRepository } from '../repositories/CompraRepository';
import { InventarioRepository } from '../../inventario/repositories/InventarioRepository';
import { Compra, CompraDetalle } from '../../shared/types';

export class CompraService {
    private compraRepo: CompraRepository;
    private inventarioRepo: InventarioRepository;

    constructor() {
        this.compraRepo = new CompraRepository();
        this.inventarioRepo = new InventarioRepository();
    }

    async procesarCompra(datosCompra: Compra, detalles: CompraDetalle[]) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Registrar Cabecera
            const idCompra = await this.compraRepo.crearCompra(datosCompra, connection);

            // 2. Procesar Detalles y Aumentar Stock
            for (const item of detalles) {
                item.id_compra = idCompra;
                
                // Guardar detalle
                await this.compraRepo.crearDetalle(item, connection);

                // AUMENTAR Inventario (cantidad positiva)
                // Nota: Si el producto no existe en inventario, deberíamos inicializarlo, 
                // pero por ahora asumimos que el producto ya fue creado en el catálogo.
                try {
                    await this.inventarioRepo.actualizarStock(item.id_producto, item.cantidad, connection);
                } catch (e) {
                    // Si falla al actualizar, intentamos inicializar (auto-fix)
                    await this.inventarioRepo.inicializar(item.id_producto); 
                    await this.inventarioRepo.actualizarStock(item.id_producto, item.cantidad, connection);
                }
            }

            await connection.commit();
            return { success: true, id_compra: idCompra, message: 'Compra registrada e inventario actualizado' };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}
