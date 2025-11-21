import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../../../config/db';
import { Producto } from '../../shared/types';

export class ProductoRepository {
    
    async findAll(): Promise<Producto[]> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM productos WHERE estado = "activo" ORDER BY nombre ASC'
        );
        return rows as Producto[];
    }

    async findBySku(sku: string): Promise<Producto | null> {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM productos WHERE sku = ?', 
            [sku]
        );
        
        if (rows.length === 0) return null;
        return rows[0] as Producto;
    }

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
}
