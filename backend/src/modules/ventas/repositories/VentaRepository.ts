// archivo: backend/src/modules/ventas/repositories/VentaRepository.ts

import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { Venta, VentaDetalle } from '../../shared/types';

export class VentaRepository {
    
    async crearVenta(venta: Venta, connection: PoolConnection): Promise<number> {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO ventas (total, metodo_pago, id_usuario, fecha) VALUES (?, ?, ?, NOW())',
            [venta.total, venta.metodo_pago, venta.id_usuario]
        );
        return result.insertId;
    }

    async crearDetalle(detalle: VentaDetalle, connection: PoolConnection): Promise<void> {
        await connection.query(
            'INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
            [detalle.id_venta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario, detalle.subtotal]
        );
    }
}