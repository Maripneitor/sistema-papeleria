import { ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { Venta, VentaDetalle } from '../../shared/types';

export class VentaRepository {
    
    // Guardar cabecera de venta (dentro de transacción)
    async crearVenta(venta: Venta, connection: PoolConnection): Promise<number> {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO ventas (total, metodo_pago, id_usuario) VALUES (?, ?, ?)',
            [venta.total, venta.metodo_pago, venta.id_usuario]
        );
        return result.insertId;
    }

    // Guardar detalles (dentro de transacción)
    async crearDetalle(detalle: VentaDetalle, connection: PoolConnection): Promise<void> {
        await connection.query(
            'INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
            [detalle.id_venta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario, detalle.subtotal]
        );
    }
}
