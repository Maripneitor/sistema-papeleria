import { ProveedorRepository } from '../repositories/ProveedorRepository';
import { Proveedor } from '../../shared/types';

export class ProveedorService {
    private repo: ProveedorRepository;

    constructor() {
        this.repo = new ProveedorRepository();
    }

    // El controlador llama a 'obtenerTodos', así que definimos ese nombre
    async obtenerTodos() {
        return await this.repo.findAll();
    }

    // El controlador llama a 'crear', definimos ese nombre
    async crear(datos: Proveedor) {
        // Validación básica
        if (!datos.nombre || datos.nombre.length < 3) {
            throw new Error('El nombre del proveedor es obligatorio');
        }
        return await this.repo.create(datos);
    }
}