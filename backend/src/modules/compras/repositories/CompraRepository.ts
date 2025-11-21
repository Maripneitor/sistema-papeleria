import { ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { Compra, CompraDetalle } from '../../shared/types';

export class CompraRepository {
    
    async crearCompra(compra: Compra, connection: PoolConnection): Promise<number> {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO compras (fecha, total, id_proveedor) VALUES (NOW(), ?, ?)',
            [compra.total, compra.id_proveedor]
        );
        return result.insertId;
    }

    async crearDetalle(detalle: CompraDetalle, connection: PoolConnection): Promise<void> {
        await connection.query(
            'INSERT INTO compras_detalle (id_compra, id_producto, cantidad, costo_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
            [detalle.id_compra, detalle.id_producto, detalle.cantidad, detalle.costo_unitario, detalle.subtotal]
        );
    }
}
