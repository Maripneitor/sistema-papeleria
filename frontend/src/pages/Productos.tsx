import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import { Plus, FileSpreadsheet, Search, Package } from 'lucide-react';
import { PageContainer, Card, CardTitle, Button, Input, Table, Badge, Grid2, FormGroup } from '../components/ui/StyledComponents';

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    
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

    const getStockColor = (stock: number) => {
        if (stock <= 5) return '#ef4444';
        if (stock <= 20) return '#f59e0b';
        return '#10b981';
    };

    return (
        <PageContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px', color: '#1e293b' }}>Inventario</h1>
                    <p style={{ color: '#64748b', margin: '5px 0 0 0', fontSize: '14px' }}>Gestiona tu catálogo de productos</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="outline" onClick={() => exportToExcel(productos, 'Inventario_Papeleria')}>
                        <FileSpreadsheet size={18} /> Excel
                    </Button>
                    <Button variant="primary" onClick={() => setMostrarForm(!mostrarForm)}>
                        <Plus size={18} /> Nuevo Producto
                    </Button>
                </div>
            </div>

            <Grid2 style={{ marginBottom: '20px', gridTemplateColumns: mostrarForm ? '1fr 2fr' : '1fr' }}>
                
                {/* FORMULARIO (COLAPSABLE) */}
                {mostrarForm && (
                    <Card style={{ height: 'fit-content', borderTop: '4px solid #4480FF' }}>
                        <CardTitle><Package size={18}/> Nuevo Artículo</CardTitle>
                        <form onSubmit={guardar}>
                            <FormGroup>
                                <label>SKU (Código de Barras)</label>
                                <Input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="Ej. 750123..." required />
                            </FormGroup>
                            <FormGroup>
                                <label>Nombre del Producto</label>
                                <Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej. Libreta Profesional..." required />
                            </FormGroup>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <FormGroup>
                                    <label>Costo ($)</label>
                                    <Input type="number" value={form.costo} onChange={e => setForm({...form, costo: e.target.value})} placeholder="0.00" required />
                                </FormGroup>
                                <FormGroup>
                                    <label>Precio Venta ($)</label>
                                    <Input type="number" value={form.precio_venta} onChange={e => setForm({...form, precio_venta: e.target.value})} placeholder="0.00" required />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <label>Categoría</label>
                                <Input value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} placeholder="Ej. Papel, Plumas..." />
                            </FormGroup>
                            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '10px' }}>Guardar Producto</Button>
                        </form>
                    </Card>
                )}

                {/* TABLA DE PRODUCTOS */}
                <Card style={{ padding: '0' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <Input 
                                placeholder="Buscar por nombre, SKU o categoría..." 
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <Table>
                            <thead>
                                <tr>
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
                                    const margen = ((p.precio_venta - p.costo) / p.precio_venta * 100).toFixed(1);
                                    
                                    return (
                                        <tr key={p.id_producto}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.nombre}</div>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>{p.sku}</div>
                                            </td>
                                            <td><Badge>{p.categoria || 'General'}</Badge></td>
                                            <td>${p.costo}</td>
                                            <td style={{ fontWeight: 700, color: '#4480FF' }}>${p.precio_venta}</td>
                                            <td style={{ fontSize: '12px', color: '#64748b' }}>{margen}%</td>
                                            <td>
                                                <Badge color={getStockColor(stock)}>
                                                    {stock} Unidades
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                    {filtrados.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No se encontraron productos</div>}
                </Card>
            </Grid2>
        </PageContainer>
    );
}