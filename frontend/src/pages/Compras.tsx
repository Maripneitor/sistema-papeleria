import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Producto, Proveedor } from '../types';

interface CompraItem extends Producto {
    cantidad_compra: number;
    costo_compra: number;
    subtotal: number;
}

export default function Compras() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<CompraItem[]>([]);
    
    const [selectedProv, setSelectedProv] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Cargar catálogos
    useEffect(() => {
        client.get('/proveedores').then(res => setProveedores(res.data.data)).catch(console.error);
        client.get('/productos').then(res => setProductos(res.data.data)).catch(console.error);
    }, []);

    const agregarAlCarrito = (prod: Producto) => {
        const cantidad = prompt(`¿Cuántas unidades de ${prod.nombre} vas a comprar?`, '10');
        if (!cantidad) return;
        
        const costo = prompt(`¿Costo unitario de compra? (Tu costo actual es $${prod.costo})`, prod.costo.toString());
        if (!costo) return;

        const item: CompraItem = {
            ...prod,
            cantidad_compra: parseInt(cantidad),
            costo_compra: parseFloat(costo),
            subtotal: parseInt(cantidad) * parseFloat(costo)
        };
        
        setCarrito([...carrito, item]);
    };

    const confirmarCompra = async () => {
        if (!selectedProv) return alert('Selecciona un proveedor');
        if (carrito.length === 0) return alert('Carrito vacío');

        setLoading(true);
        const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

        const payload = {
            compra: {
                total: total,
                id_proveedor: parseInt(selectedProv),
                fecha: new Date()
            },
            detalles: carrito.map(item => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad_compra,
                costo_unitario: item.costo_compra,
                subtotal: item.subtotal
            }))
        };

        try {
            await client.post('/compras', payload);
            alert('✅ Compra registrada con éxito. Stock actualizado.');
            setCarrito([]);
        } catch (error: any) {
            alert('Error al registrar compra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* PANEL IZQUIERDO: SELECCIÓN */}
            <div>
                <h1>📦 Registrar Entrada (Compra)</h1>
                
                <div style={{ marginBottom: '20px' }}>
                    <label>Proveedor:</label>
                    <select 
                        style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        value={selectedProv}
                        onChange={e => setSelectedProv(e.target.value)}
                    >
                        <option value="">-- Selecciona Proveedor --</option>
                        {proveedores.map(p => (
                            <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                        ))}
                    </select>
                </div>

                <h3>Productos Disponibles</h3>
                <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc' }}>
                    {productos.map(p => (
                        <div key={p.id_producto} 
                             style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                             onClick={() => agregarAlCarrito(p)}
                        >
                            <span>{p.nombre}</span>
                            <span style={{ color: '#666' }}>Stock: {p.stock_actual ?? 0}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* PANEL DERECHO: DETALLE COMPRA */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
                <h2>📝 Orden de Compra</h2>
                {carrito.length === 0 && <p>Selecciona productos de la izquierda...</p>}
                
                {carrito.map((item, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                        <strong>{item.nombre}</strong>
                        <div>Cant: {item.cantidad_compra} | Costo: ${item.costo_compra}</div>
                        <div style={{ textAlign: 'right', fontWeight: 'bold' }}>${item.subtotal}</div>
                    </div>
                ))}

                {carrito.length > 0 && (
                    <div style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '10px' }}>
                        <h3>Total a Pagar: ${carrito.reduce((s, i) => s + i.subtotal, 0)}</h3>
                        <button 
                            onClick={confirmarCompra} 
                            disabled={loading}
                            style={{ width: '100%', padding: '15px', background: '#e11d48', color: 'white', border: 'none', fontSize: '1.2em', cursor: 'pointer' }}
                        >
                            {loading ? 'Procesando...' : 'CONFIRMAR ENTRADA'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
