import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../../../config/db';
import { Usuario } from '../../shared/types';

export class UsuarioRepository {
    
    async findAll(): Promise<Usuario[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT id_usuario, nombre, usuario, rol, activo FROM usuarios');
        return rows as Usuario[];
    }

    async findByUsername(username: string): Promise<Usuario | null> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuarios WHERE usuario = ?', [username]);
        if (rows.length === 0) return null;
        return rows[0] as Usuario;
    }

    async create(datos: Usuario): Promise<number> {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuarios (nombre, usuario, password_hash, rol, activo) VALUES (?, ?, ?, ?, 1)',
            [datos.nombre, datos.usuario, datos.password_hash, datos.rol]
        );
        return result.insertId;
    }
}
