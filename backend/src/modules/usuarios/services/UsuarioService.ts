import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../../shared/types';
import { AppError } from '../../../shared/utils/AppError';

export class UsuarioService {
    private repo: UsuarioRepository;

    constructor() {
        this.repo = new UsuarioRepository();
    }

    async obtenerTodos() {
        return await this.repo.findAll();
    }

    async crear(datos: Usuario) {
        if (!datos.usuario || !datos.password_hash || !datos.nombre) {
            throw new AppError('Todos los campos son obligatorios', 400);
        }

        // Validar duplicados usando el método que acabamos de agregar
        const existe = await this.repo.findByUsername(datos.usuario);
        if (existe) {
            throw new AppError('El nombre de usuario ya existe', 409);
        }
        
        return await this.repo.create(datos);
    }
}