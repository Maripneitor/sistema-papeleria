import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../../../config/db';
import { Proveedor } from '../../shared/types';

export class ProveedorRepository {
    
    async findAll(): Promise<Proveedor[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM proveedores ORDER BY nombre ASC');
        return rows as Proveedor[];
    }

    async create(datos: Proveedor): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)',
            [datos.nombre, datos.contacto, datos.telefono, datos.correo, datos.direccion]
        );
        return result.insertId;
    }
}
