import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import { Plus, FileSpreadsheet, Search, Package, AlertTriangle } from 'lucide-react';

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    
    // Formulario local
    const [form, setForm] = useState({
        sku: '', nombre: '', precio_venta: '', costo: '', stock_inicial: '0', categoria: 'General'
    });

    const cargar = () => {
        setLoading(true);
        client.get<ApiResponse<Producto[]>>('/productos')
            .then(res => setProductos(res.data.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/productos', {
                ...form,
                precio_venta: parseFloat(form.precio_venta),
                costo: parseFloat(form.costo),
                // Nota: El stock inicial se manejaría idealmente con una "compra" de ajuste, 
                // pero para este MVP lo dejaremos en 0 o requeriría ajustar el endpoint.
                rotacion: 'media',
                estado: 'activo'
            });
            alert('✅ Producto Creado');
            setMostrarForm(false);
            setForm({ sku: '', nombre: '', precio_venta: '', costo: '', stock_inicial: '0', categoria: 'General' });
            cargar();
        } catch (error: any) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.sku.includes(busqueda)
    );

    // Función para semáforo de stock
    const getStockStatus = (stock: number) => {
        if (stock <= 5) return { color: '#ef4444', text: 'Crítico', icon: <AlertTriangle size={14} /> };
        if (stock <= 20) return { color: '#f59e0b', text: 'Bajo', icon: null };
        return { color: '#10b981', text: 'Bien', icon: null };
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>📦 Inventario Maestro</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={() => exportToExcel(productos, 'Inventario_Papeleria')}>
                        <FileSpreadsheet size={18} /> Exportar Excel
                    </button>
                    <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>
            </div>

            {/* FORMULARIO FLOTANTE (SIMPLE) */}
            {mostrarForm && (
                <div className="card" style={{ marginBottom: '20px', borderLeft: '4px solid #2563eb' }}>
                    <h3>✨ Registrar Nuevo Artículo</h3>
                    <form onSubmit={guardar} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                        <input className="buscador" placeholder="SKU (Código)" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required />
                        <input className="buscador" placeholder="Nombre Producto" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                        <input className="buscador" type="number" placeholder="Costo ($)" value={form.costo} onChange={e => setForm({...form, costo: e.target.value})} required />
                        <input className="buscador" type="number" placeholder="Precio Venta ($)" value={form.precio_venta} onChange={e => setForm({...form, precio_venta: e.target.value})} required />
                        <input className="buscador" placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} />
                        <button type="submit" className="btn btn-success" style={{ justifyContent: 'center' }}>Guardar</button>
                    </form>
                </div>
            )}

            {/* BARRA DE BÚSQUEDA */}
            <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
            </div>

            {/* TABLA PROFESIONAL */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th>SKU</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Margen</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map(p => {
                            const stock = p.stock_actual || 0;
                            const status = getStockStatus(stock);
                            const margen = ((p.precio_venta - p.costo) / p.precio_venta * 100).toFixed(1);
                            
                            return (
                                <tr key={p.id_producto}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{p.sku}</td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                                    </td>
                                    <td><span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{p.categoria || 'Gral'}</span></td>
                                    <td>${p.costo}</td>
                                    <td style={{ fontWeight: 'bold', color: '#2563eb' }}>${p.precio_venta}</td>
                                    <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{margen}%</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: status.color, fontWeight: 'bold' }}>
                                            {status.icon}
                                            {stock}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtrados.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No se encontraron productos</div>}
            </div>
        </div>
    );
}
