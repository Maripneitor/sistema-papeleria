import pool from '../../../config/db';
import { VentaRepository } from '../repositories/VentaRepository';
import { InventarioRepository } from '../../inventario/repositories/InventarioRepository';
import { Venta, VentaDetalle } from '../../shared/types'; // Asegúrate que estos tipos existan en el paso 4
import { AppError } from '../../../shared/utils/AppError';

export class VentaService {
    private ventaRepo: VentaRepository;
    private inventarioRepo: InventarioRepository;

    constructor() {
        this.ventaRepo = new VentaRepository();
        this.inventarioRepo = new InventarioRepository();
    }

    async procesarVenta(venta: Venta, detalles: VentaDetalle[]) {
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();

            // 1. Verificar stock suficiente
            for (const item of detalles) {
                const inventario = await this.inventarioRepo.obtenerPorProducto(item.id_producto, connection);
                if (!inventario || inventario.stock_actual < item.cantidad) {
                    throw new AppError(`Stock insuficiente para el producto ID: ${item.id_producto}`, 400);
                }
            }

            // 2. Crear Venta Cabecera
            // idVenta es la variable local (camelCase)
            const idVenta = await this.ventaRepo.crearVenta(venta, connection);

            // 3. Crear Detalles y Descontar Stock
            for (const item of detalles) {
                item.id_venta = idVenta;
                await this.ventaRepo.crearDetalle(item, connection);
                await this.inventarioRepo.actualizarStock(item.id_producto, -item.cantidad, connection);
            }

            await connection.commit();
            
            // CORRECCIÓN: Asignamos idVenta a la propiedad id_venta
            return { id_venta: idVenta, message: 'Venta registrada con éxito' };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}