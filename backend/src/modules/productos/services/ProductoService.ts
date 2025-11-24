// archivo: backend/src/modules/productos/services/ProductoService.ts

import { ProductoRepository } from '../repositories/ProductoRepository';
import { Producto } from '../../shared/types';
import { AppError } from '../../../shared/utils/AppError';

export class ProductoService {
    private repository: ProductoRepository;

    constructor() {
        this.repository = new ProductoRepository();
    }

    async obtenerCatalogo() {
        return await this.repository.findAll();
    }

    async registrarProducto(datos: Producto) {
        // 1. Validaciones de negocio básicas
        if (!datos.sku || !datos.nombre) {
            throw new AppError('El SKU y el nombre son obligatorios', 400);
        }

        if (datos.precio_venta < datos.costo) {
            throw new AppError('El precio de venta no puede ser menor al costo', 400);
        }

        // 2. Verificar duplicados
        const existente = await this.repository.findBySku(datos.sku);
        if (existente) {
            throw new AppError(`El producto con SKU ${datos.sku} ya existe`, 409); // 409 Conflict
        }

        // 3. Guardar
        const id = await this.repository.create(datos);
        return { ...datos, id_producto: id };
    }

    async actualizarProducto(id: number, datos: Partial<Producto>) {
        const existe = await this.repository.findById(id);
        if (!existe) throw new AppError('Producto no encontrado', 404);

        const actualizado = await this.repository.update(id, datos);
        if (!actualizado) throw new AppError('No se pudo actualizar el producto', 500);

        return { message: 'Producto actualizado correctamente' };
    }

    async eliminarProducto(id: number) {
        const existe = await this.repository.findById(id);
        if (!existe) throw new AppError('Producto no encontrado', 404);

        await this.repository.delete(id);
        return { message: 'Producto eliminado (desactivado)' };
    }
}