import { ProductoRepository } from '../repositories/ProductoRepository';
import { Producto } from '../../shared/types';

export class ProductoService {
    private repository: ProductoRepository;

    constructor() {
        this.repository = new ProductoRepository();
    }

    async obtenerCatalogo(): Promise<Producto[]> {
        return await this.repository.findAll();
    }

    async registrarProducto(datos: Producto): Promise<Producto> {
        if (!datos.sku || !datos.nombre || !datos.precio_venta || !datos.costo) {
            throw new Error('Faltan datos obligatorios');
        }

        if (datos.precio_venta < datos.costo) {
            throw new Error('El precio de venta no puede ser menor al costo');
        }

        const existente = await this.repository.findBySku(datos.sku);
        if (existente) {
            throw new Error(`El producto con SKU ${datos.sku} ya existe`);
        }

        const nuevoId = await this.repository.create(datos);
        
        return { ...datos, id_producto: nuevoId };
    }
}
