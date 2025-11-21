import { RowDataPacket, PoolConnection } from 'mysql2/promise';
import pool from '../../../config/db';
import { Inventario } from '../../shared/types';

export class InventarioRepository {

    // Inicializar inventario para un producto nuevo (Stock 0)
    async inicializar(idProducto: number): Promise<void> {
        await pool.query(
            'INSERT INTO inventario (id_producto, stock_actual, stock_minimo, stock_maximo, ubicacion) VALUES (?, 0, 5, 100, "Bodega General")',
            [idProducto]
        );
    }

    // Obtener stock actual
    async obtenerPorProducto(idProducto: number): Promise<Inventario | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM inventario WHERE id_producto = ?',
            [idProducto]
        );
        return rows.length ? (rows[0] as Inventario) : null;
    }

    // Actualizar stock (Soporta transacciones externas para las ventas)
    async actualizarStock(idProducto: number, cantidad: number, conexion?: PoolConnection): Promise<void> {
        const db = conexion || pool;
        // Si cantidad es negativa (venta), resta. Si es positiva (compra), suma.
        await db.query(
            'UPDATE inventario SET stock_actual = stock_actual + ? WHERE id_producto = ?',
            [cantidad, idProducto]
        );
    }
}
