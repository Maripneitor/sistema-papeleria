import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { Usuario } from '../../shared/types';

export class UsuarioService {
    private repo: UsuarioRepository;

    constructor() {
        this.repo = new UsuarioRepository();
    }

    async obtenerLista() {
        return await this.repo.findAll();
    }

    async registrar(datos: Usuario) {
        // Validaciones
        if (!datos.usuario || !datos.password_hash || !datos.nombre) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Verificar duplicados
        const existe = await this.repo.findByUsername(datos.usuario);
        if (existe) {
            throw new Error('El nombre de usuario ya existe');
        }

        const id = await this.repo.create(datos);
        return { ...datos, id_usuario: id };
    }
}
