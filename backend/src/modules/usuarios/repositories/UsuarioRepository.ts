import { ResultSetHeader } from 'mysql2';
import pool from '../../../config/db';
import { IUsuarioRow, Usuario } from '../../shared/types';

export class UsuarioRepository {
    
    async findAll() {
        const [rows] = await pool.query<IUsuarioRow[]>('SELECT id_usuario, nombre, usuario, rol FROM usuarios');
        return rows;
    }

    // ESTE METODO FALTABA:
    async findByUsername(username: string): Promise<Usuario | null> {
        const [rows] = await pool.query<IUsuarioRow[]>(
            'SELECT * FROM usuarios WHERE usuario = ?', 
            [username]
        );
        return rows.length ? rows[0] : null;
    }

    async create(data: Usuario) {
        const [res] = await pool.query<ResultSetHeader>(
            'INSERT INTO usuarios (nombre, usuario, password_hash, rol) VALUES (?, ?, ?, ?)',
            [data.nombre, data.usuario, data.password_hash, data.rol]
        );
        return res.insertId;
    }
}