import { ProductoRepository } from '../repositories/ProductoRepository';
import { Producto } from '../../../shared/types';

export class ProductoService {
    private repository: ProductoRepository;

    constructor() {
        this.repository = new ProductoRepository();
    }

    // Lógica para obtener catálogo
    async obtenerCatalogo(): Promise<Producto[]> {
        return await this.repository.findAll();
    }

    // Lógica para registrar producto nuevo
    async registrarProducto(datos: Producto): Promise<Producto> {
        // 1. Validar datos obligatorios mínimos
        if (!datos.sku || !datos.nombre || !datos.precio_venta || !datos.costo) {
            throw new Error('Faltan datos obligatorios (SKU, Nombre, Precio, Costo)');
        }

        // 2. Validar que el precio no sea menor al costo (Regla de negocio básica)
        if (datos.precio_venta < datos.costo) {
            throw new Error('El precio de venta no puede ser menor al costo');
        }

        // 3. Verificar si el SKU ya existe
        const existente = await this.repository.findBySku(datos.sku);
        if (existente) {
            throw new Error(`El producto con SKU ${datos.sku} ya existe`);
        }

        // 4. Guardar
        const nuevoId = await this.repository.create(datos);
        
        // 5. Retornar el objeto completo con su nuevo ID
        return { ...datos, id_producto: nuevoId };
    }
}
