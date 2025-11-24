// archivo: backend/src/modules/inventario/repositories/InventarioRepository.ts

import { PoolConnection, RowDataPacket } from 'mysql2/promise';
import pool from '../../../config/db';
import { IInventarioRow } from '../../shared/types';

export class InventarioRepository {
    
    // Obtener inventario de un producto
    async obtenerPorProducto(idProducto: number, connection?: PoolConnection): Promise<IInventarioRow | null> {
        const db = connection || pool;
        const [rows] = await db.query<IInventarioRow[]>(
            'SELECT * FROM inventario WHERE id_producto = ?',
            [idProducto]
        );
        return rows.length ? rows[0] : null;
    }

    // Inicializar inventario (para producto nuevo)
    async inicializar(idProducto: number): Promise<void> {
        await pool.query(
            'INSERT INTO inventario (id_producto, stock_actual, stock_minimo, stock_maximo) VALUES (?, 0, 5, 100)',
            [idProducto]
        );
    }

    // Actualizar stock (Atómico dentro de transacción)
    async actualizarStock(idProducto: number, cantidad: number, connection: PoolConnection): Promise<void> {
        // Cantidad positiva suma (compra), negativa resta (venta)
        await connection.query(
            'UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_producto = ?',
            [cantidad, idProducto]
        );
    }
}