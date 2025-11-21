import pool from './config/db';
import { InventarioRepository } from './modules/inventario/repositories/InventarioRepository';
import { VentaService } from './modules/ventas/services/VentaService';
import { Venta, VentaDetalle } from './modules/shared/types';

const runTest = async () => {
    console.log('🧪 Iniciando prueba de VENTAS e INVENTARIO...');
    const inventario = new InventarioRepository();
    const ventas = new VentaService();

    try {
        // ID del producto creado en la prueba anterior (Asumimos ID 1)
        const idProd = 1; 

        // 1. Inicializar y Dar entrada de stock (Simular compra de 50 unidades)
        // Nota: En producción esto lo haría el servicio de Compras
        console.log('📦 Agregando 50 unidades al inventario...');
        // Intentamos inicializar por si no existe
        try { await inventario.inicializar(idProd); } catch(e) {} 
        await inventario.actualizarStock(idProd, 50);

        // 2. Crear objeto de Venta
        const nuevaVenta: Venta = {
            id_venta: 0,
            fecha: new Date(),
            total: 51.00,
            metodo_pago: 'Efectivo',
            id_usuario: 1 // Usuario Dummy
        };

        const detalles: VentaDetalle[] = [
            {
                id_detalle: 0,
                id_venta: 0,
                id_producto: idProd,
                cantidad: 2, // Vendemos 2
                precio_unitario: 25.50,
                subtotal: 51.00
            }
        ];

        // 3. Procesar la venta
        console.log('💸 Procesando venta de 2 unidades...');
        const resultado = await ventas.procesarVenta(nuevaVenta, detalles);
        console.log('✅ Resultado Venta:', resultado);

        // 4. Verificar stock final
        const stockFinal = await inventario.obtenerPorProducto(idProd);
        console.log(`📉 Stock final en BD: ${stockFinal?.stock_actual} (Debería ser 48)`);

    } catch (error: any) {
        console.error('❌ Error en la prueba:', error.message);
    }

    process.exit(0);
};

runTest();
