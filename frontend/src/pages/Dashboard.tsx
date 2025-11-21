import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';

export default function Dashboard() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            const { data } = await client.get<ApiResponse<Producto[]>>('/productos');
            if (data.success) {
                setProductos(data.data);
            }
        } catch (err) {
            setError('No se pudo conectar al servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>📦 Dashboard Papelería</h1>
            <hr />
            
            {loading && <p>Cargando datos...</p>}
            {error && <p style={{ color: 'red' }}>❌ {error}</p>}

            {!loading && !error && (
                <div>
                    <h3>Catálogo de Productos (Desde MySQL)</h3>
                    <p>Total encontrados: {productos.length}</p>
                    
                    <ul style={{ marginTop: '20px' }}>
                        {productos.map(prod => (
                            <li key={prod.id_producto} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
                                <strong>{prod.nombre}</strong> <br />
                                SKU: {prod.sku} | Precio: ${prod.precio_venta}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
