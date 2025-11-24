// archivo: backend/src/modules/productos/repositories/ProductoRepository.ts

import { ResultSetHeader } from 'mysql2';
import pool from '../../../config/db';
import { Producto, IProductoRow } from '../../shared/types';

export class ProductoRepository {

    async findAll(): Promise<Producto[]> {
        // Usamos LEFT JOIN con inventario para traer el stock actual si existe
        const query = `
            SELECT p.*, IFNULL(i.stock_actual, 0) as stock_actual 
            FROM productos p
            LEFT JOIN inventario i ON p.id_producto = i.id_producto
            WHERE p.estado = 'activo'
            ORDER BY p.nombre ASC
        `;
        const [rows] = await pool.query<IProductoRow[]>(query);
        return rows;
    }

    async findById(id: number): Promise<Producto | null> {
        const [rows] = await pool.query<IProductoRow[]>(
            'SELECT * FROM productos WHERE id_producto = ? AND estado = "activo"', 
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    async findBySku(sku: string): Promise<Producto | null> {
        const [rows] = await pool.query<IProductoRow[]>(
            'SELECT * FROM productos WHERE sku = ?', 
            [sku]
        );
        return rows.length ? rows[0] : null;
    }

    async create(producto: Producto): Promise<number> {
        const { 
            sku, nombre, descripcion, categoria, marca, 
            precio_venta, costo, codigo_barras, rotacion 
        } = producto;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO productos 
            (sku, nombre, descripcion, categoria, marca, precio_venta, costo, codigo_barras, rotacion, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
            [sku, nombre, descripcion, categoria, marca, precio_venta, costo, codigo_barras, rotacion || 'media']
        );
        return result.insertId;
    }

    async update(id: number, producto: Partial<Producto>): Promise<boolean> {
        // Construcción dinámica de query para actualizar solo lo que venga
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(producto).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id_producto') {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (fields.length === 0) return false;

        values.push(id);
        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE productos SET ${fields.join(', ')} WHERE id_producto = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    // Soft delete (cambiar estado a inactivo)
    async delete(id: number): Promise<boolean> {
        const [result] = await pool.query<ResultSetHeader>(
            'UPDATE productos SET estado = "inactivo" WHERE id_producto = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}