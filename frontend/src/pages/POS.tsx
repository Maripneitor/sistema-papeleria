import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';

// Interfaz local para el carrito (extiende Producto con cantidad)
interface CartItem extends Producto {
    cantidad: number;
    subtotal: number;
}

export default function POS() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [carrito, setCarrito] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar catálogo al iniciar
    useEffect(() => {
        client.get<ApiResponse<Producto[]>>('/productos')
            .then(res => setProductos(res.data.data))
            .catch(err => console.error(err));
    }, []);

    // Filtrar productos visualmente
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.sku.includes(busqueda)
    );

    // Agregar al carrito
    const agregarAlCarrito = (prod: Producto) => {
        setCarrito(prev => {
            const existente = prev.find(item => item.id_producto === prod.id_producto);
            if (existente) {
                return prev.map(item => 
                    item.id_producto === prod.id_producto
                        ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_venta }
                        : item
                );
            }
            return [...prev, { ...prod, cantidad: 1, subtotal: prod.precio_venta }];
        });
    };

    // Calcular Total
    const totalVenta = carrito.reduce((sum, item) => sum + item.subtotal, 0);

    // Procesar Venta (Enviar al Backend)
    const cobrar = async () => {
        if (carrito.length === 0) return;
        setLoading(true);

        const ventaPayload = {
            venta: {
                total: totalVenta,
                metodo_pago: 'Efectivo', // Hardcodeado por ahora
                id_usuario: 1 // Admin por defecto
            },
            detalles: carrito.map(item => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precio_venta,
                subtotal: item.subtotal
            }))
        };

        try {
            const res = await client.post('/ventas', ventaPayload);
            if (res.data.success) {
                alert(`✅ Venta registrada! ID: ${res.data.id_venta}`);
                setCarrito([]); // Limpiar carrito
            }
        } catch (error: any) {
            alert('❌ Error al cobrar: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pos-container">
            {/* ZONA IZQUIERDA: PRODUCTOS */}
            <div className="panel-izquierdo">
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por nombre o SKU..." 
                    className="buscador"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                />
                <div className="grid-productos">
                    {productosFiltrados.map(prod => (
                        <div key={prod.id_producto} className="card-producto" onClick={() => agregarAlCarrito(prod)}>
                            <div className="prod-nombre">{prod.nombre}</div>
                            <div className="prod-precio">${prod.precio_venta}</div>
                            <div className="prod-stock">Stock: {prod.stock_actual ?? 'N/A'}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ZONA DERECHA: TICKET */}
            <div className="panel-derecho">
                <h2>🛒 Ticket de Venta</h2>
                <div className="lista-carrito">
                    {carrito.length === 0 ? <p style={{color: '#888'}}>Carrito vacío</p> : (
                        carrito.map((item, idx) => (
                            <div key={idx} className="item-carrito">
                                <span>{item.cantidad}x {item.nombre}</span>
                                <span>${item.subtotal.toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="total-section">
                    <h3>Total: ${totalVenta.toFixed(2)}</h3>
                    <button 
                        className="btn-cobrar" 
                        onClick={cobrar}
                        disabled={loading || carrito.length === 0}
                    >
                        {loading ? 'Procesando...' : '💰 COBRAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}
