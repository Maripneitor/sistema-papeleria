import { ProductoService } from './modules/productos/services/ProductoService';
import { Producto } from './modules/shared/types';

const runTest = async () => {
    const service = new ProductoService();

    console.log('🧪 Iniciando prueba de lógica...');

    const productoPrueba: Producto = {
        id_producto: 0,
        sku: 'PRUEBA-001',
        nombre: 'Libreta Profesional Cuadros',
        descripcion: 'Libreta de 100 hojas',
        precio_venta: 25.50,
        costo: 18.00,
        categoria: 'Papel',
        marca: 'Scribe',
        fecha_alta: new Date(),
        estado: 'activo',
        rotacion: 'media'
    };

    try {
        const resultado = await service.registrarProducto(productoPrueba);
        console.log('✅ Producto guardado con éxito:', resultado);
    } catch (error: any) {
        console.error('⚠️ Resultado:', error.message);
    }
    
    process.exit(0);
};

runTest();
