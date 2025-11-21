import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function Reportes() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.get('/reportes/dashboard')
            .then(res => setData(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{padding: 20}}>Cargando análisis...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>📈 Reportes de Negocio</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                
                {/* TARJETA 1: TOP PRODUCTOS */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ borderBottom: '2px solid #2563eb', paddingBottom: '10px' }}>🏆 Top Productos Vendidos</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#666' }}>
                                <th>Producto</th>
                                <th>Unidades</th>
                                <th>Ingreso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.topProductos.map((p: any, i: number) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee', height: '40px' }}>
                                    <td>{p.nombre}</td>
                                    <td style={{ fontWeight: 'bold' }}>{p.total_unidades}</td>
                                    <td style={{ color: '#16a34a' }}>${p.total_dinero}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* TARJETA 2: VENTAS SEMANALES */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ borderBottom: '2px solid #16a34a', paddingBottom: '10px' }}>📅 Ventas Últimos 7 Días</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#666' }}>
                                <th>Fecha</th>
                                <th>Tickets</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.ventasSemana.map((v: any, i: number) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee', height: '40px' }}>
                                    <td>{v.fecha}</td>
                                    <td>{v.num_tickets}</td>
                                    <td style={{ fontWeight: 'bold', color: '#2563eb' }}>${v.total_venta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
