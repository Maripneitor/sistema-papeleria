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

    // Ventas de la semana
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

    // KPIs Generales (El método nuevo corregido)
    async obtenerKPIs() {
        // 1. Total ventas hoy
        const [ventasHoy] = await pool.query<RowDataPacket[]>(
            "SELECT SUM(total) as total, COUNT(*) as tickets FROM ventas WHERE DATE(fecha) = CURDATE()"
        );
        
        // 2. Total ventas mes actual
        const [ventasMes] = await pool.query<RowDataPacket[]>(
            "SELECT SUM(total) as total FROM ventas WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())"
        );
    
        // 3. Productos con stock bajo
        const [stockBajo] = await pool.query<RowDataPacket[]>(
            "SELECT COUNT(*) as cantidad FROM inventario WHERE stock_actual <= stock_minimo"
        );
    
        return {
            ventas_hoy: ventasHoy[0].total || 0,
            tickets_hoy: ventasHoy[0].tickets || 0,
            ventas_mes: ventasMes[0].total || 0,
            alertas_stock: stockBajo[0].cantidad || 0
        };
    }
}