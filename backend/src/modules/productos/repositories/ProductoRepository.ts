import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../../../../config/db';
import { Producto } from '../../../shared/types';

export class ProductoRepository {
    
    // Buscar todos los productos activos
    async findAll(): Promise<Producto[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM productos WHERE estado = "activo" ORDER BY nombre ASC'
        );
        return rows as Producto[];
    }

    // Buscar un producto por su SKU (para evitar duplicados)
    async findBySku(sku: string): Promise<Producto | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM productos WHERE sku = ?', 
            [sku]
        );
        
        if (rows.length === 0) return null;
        return rows[0] as Producto;
    }

    // Crear nuevo producto
    async create(producto: Producto): Promise<number> {
        const { 
            sku, nombre, descripcion, categoria, marca, 
            precio_venta, costo, codigo_barras, rotacion 
        } = producto;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO productos 
            (sku, nombre, descripcion, categoria, marca, precio_venta, costo, codigo_barras, rotacion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [sku, nombre, descripcion, categoria, marca, precio_venta, costo, codigo_barras, rotacion]
        );

        return result.insertId;
    }

    // Actualizar stock (se usará en inventario/ventas)
    async updateStock(id_producto: number, cantidad: number): Promise<void> {
        // Nota: Esto se conectará con la tabla inventario más adelante
        // Por ahora dejamos la estructura lista
        console.log(`Actualizando stock virtual del producto ${id_producto}: ${cantidad}`);
    }
}
