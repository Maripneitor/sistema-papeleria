import pool from '../../../config/db';
import { VentaRepository } from '../repositories/VentaRepository';
import { InventarioRepository } from '../../inventario/repositories/InventarioRepository';
import { Venta, VentaDetalle } from '../../shared/types';

export class VentaService {
    private ventaRepo: VentaRepository;
    private inventarioRepo: InventarioRepository;

    constructor() {
        this.ventaRepo = new VentaRepository();
        this.inventarioRepo = new InventarioRepository();
    }

    async procesarVenta(datosVenta: Venta, detalles: VentaDetalle[]) {
        const connection = await pool.getConnection();
        
        try {
            // 1. Iniciar Transacción (Todo o Nada)
            await connection.beginTransaction();

            // 2. Crear Venta Cabecera
            const idVenta = await this.ventaRepo.crearVenta(datosVenta, connection);

            // 3. Procesar cada producto
            for (const item of detalles) {
                // Validar stock antes de vender (Lógica básica)
                const stock = await this.inventarioRepo.obtenerPorProducto(item.id_producto);
                if (!stock || stock.stock_actual < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ID: ${item.id_producto}`);
                }

                // Guardar detalle
                item.id_venta = idVenta;
                await this.ventaRepo.crearDetalle(item, connection);

                // Descontar inventario (Usando la misma conexión transaccional)
                await this.inventarioRepo.actualizarStock(item.id_producto, -item.cantidad, connection);
            }

            // 4. Confirmar cambios
            await connection.commit();
            return { success: true, id_venta: idVenta, mensaje: 'Venta procesada correctamente' };

        } catch (error) {
            // 5. Si algo falla, deshacer TODO
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}
