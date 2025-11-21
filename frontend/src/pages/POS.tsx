import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';
import { generarTicketPDF } from '../utils/exportUtils';
import { Printer } from 'lucide-react';

// Interfaz local para el carrito
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

    // Procesar Venta
    const cobrar = async () => {
        if (carrito.length === 0) return;
        setLoading(true);

        const ventaPayload = {
            venta: {
                total: totalVenta,
                metodo_pago: 'Efectivo',
                id_usuario: 1 
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
                // PREGUNTAR SI IMPRIMIR TICKET
                // Usamos un pequeño timeout para que React renderice antes del confirm
                setTimeout(() => {
                    const imprimir = confirm('✅ Venta registrada. ¿Imprimir Ticket?');
                    if (imprimir) {
                        generarTicketPDF({ total: totalVenta }, carrito);
                    }
                }, 100);
                setCarrito([]); 
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
                    placeholder="�� Buscar por nombre o SKU..." 
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
                        {loading ? 'Procesando...' : (
                            <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                                <Printer size={24} /> COBRAR
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
