import { ResultSetHeader } from 'mysql2';
import pool from '../../../config/db';
import { IProveedorRow, Proveedor } from '../../shared/types';

export class ProveedorRepository {
    async findAll() {
        const [rows] = await pool.query<IProveedorRow[]>('SELECT * FROM proveedores');
        return rows;
    }
    async create(data: Proveedor) {
        const [res] = await pool.query<ResultSetHeader>(
            'INSERT INTO proveedores (nombre, contacto, telefono, correo) VALUES (?, ?, ?, ?)',
            [data.nombre, data.contacto, data.telefono, data.correo]
        );
        return res.insertId;
    }
}