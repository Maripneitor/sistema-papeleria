import { ProveedorRepository } from '../repositories/ProveedorRepository';
import { Proveedor } from '../../shared/types';

export class ProveedorService {
    private repo: ProveedorRepository;

    constructor() {
        this.repo = new ProveedorRepository();
    }

    async obtenerLista() {
        return await this.repo.findAll();
    }

    async registrar(datos: Proveedor) {
        // Validación simple: Nombre obligatorio
        if (!datos.nombre || datos.nombre.length < 3) {
            throw new Error('El nombre del proveedor es obligatorio y debe tener al menos 3 letras');
        }
        const id = await this.repo.create(datos);
        return { ...datos, id_proveedor: id };
    }
}
