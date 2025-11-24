import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';
import { exportToExcel } from '../utils/exportUtils';
import { Plus, FileSpreadsheet, Search } from 'lucide-react';
import { 
    PageContainer, Card, Title, Subtitle, Button, Input, 
    Badge, Grid2, HeaderSection 
} from '../components/ui/SystemDesign';

export default function Productos() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        sku: '', nombre: '', precio_venta: '', costo: '', categoria: 'General'
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
            setForm({ sku: '', nombre: '', precio_venta: '', costo: '', categoria: 'General' });
            cargar();
        } catch (error: any) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const filtrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.sku.includes(busqueda)
    );

    const getStockBadge = (stock: number) => {
        if (stock <= 5) return <Badge type="danger">Crítico ({stock})</Badge>;
        if (stock <= 20) return <Badge type="warning">Bajo ({stock})</Badge>;
        return <Badge type="success">Bien ({stock})</Badge>;
    };

    return (
        <PageContainer>
            <HeaderSection>
                <div>
                    <Title>Inventario Maestro</Title>
                    <Subtitle>Gestiona tu catálogo de productos y precios</Subtitle>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {/* CORRECCIÓN: Usamos $variant */}
                    <Button $variant="secondary" onClick={() => exportToExcel(productos, 'Inventario_Papeleria')}>
                        <FileSpreadsheet size={18} /> Excel
                    </Button>
                    <Button onClick={() => setMostrarForm(!mostrarForm)}>
                        <Plus size={18} /> Nuevo Producto
                    </Button>
                </div>
            </HeaderSection>

            <Grid2 style={{ gridTemplateColumns: mostrarForm ? '1fr 2fr' : '1fr' }}>
                
                {/* FORMULARIO */}
                {mostrarForm && (
                    <Card style={{ height: 'fit-content' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>✨ Nuevo Artículo</h3>
                        <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4, display: 'block' }}>SKU</label>
                                <Input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="Código de barras" required />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4, display: 'block' }}>Nombre</label>
                                <Input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Nombre del producto" required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4, display: 'block' }}>Costo</label>
                                    <Input type="number" value={form.costo} onChange={e => setForm({...form, costo: e.target.value})} placeholder="0.00" required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4, display: 'block' }}>Precio Venta</label>
                                    <Input type="number" value={form.precio_venta} onChange={e => setForm({...form, precio_venta: e.target.value})} placeholder="0.00" required />
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: 4, display: 'block' }}>Categoría</label>
                                <Input value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} placeholder="Ej. Papelería" />
                            </div>
                            <Button type="submit">Guardar Producto</Button>
                        </form>
                    </Card>
                )}

                {/* TABLA */}
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
                        <div style={{ position: 'relative', maxWidth: '300px' }}>
                            <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#999' }} />
                            <Input 
                                placeholder="Buscar..." 
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead style={{ background: '#FAFAFA', borderBottom: '1px solid #eee' }}>
                                <tr>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666' }}>Producto</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666' }}>Categoría</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666' }}>Precio</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#666' }}>Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map(p => (
                                    <tr key={p.id_producto} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ fontWeight: 600 }}>{p.nombre}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{p.sku}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}><Badge>{p.categoria || 'General'}</Badge></td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>${p.precio_venta}</td>
                                        <td style={{ padding: '12px 16px' }}>{getStockBadge(p.stock_actual || 0)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </Grid2>
        </PageContainer>
    );
}