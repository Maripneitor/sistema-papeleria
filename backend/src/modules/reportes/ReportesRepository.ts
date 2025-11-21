import { RowDataPacket } from 'mysql2';
import pool from '../../config/db';

export class ReportesRepository {

    // Top 5 Productos más vendidos
    async obtenerTopProductos() {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT p.nombre, SUM(vd.cantidad) as total_unidades, SUM(vd.subtotal) as total_dinero
            FROM ventas_detalle vd
            JOIN productos p ON vd.id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre
            ORDER BY total_unidades DESC
            LIMIT 5
        `);
        return rows;
    }

    // Ventas de la semana (CORREGIDO)
    async obtenerVentasSemana() {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT 
                DATE_FORMAT(fecha, '%Y-%m-%d') as fecha, 
                SUM(total) as total_venta, 
                COUNT(*) as num_tickets
            FROM ventas
            WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE_FORMAT(fecha, '%Y-%m-%d')
            ORDER BY fecha ASC
        `);
        return rows;
    }
}
