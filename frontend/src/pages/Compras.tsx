import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Producto, Proveedor } from '../types';
import { Truck, Package, Plus, Trash2, CheckCircle, Search } from 'lucide-react';
import { 
    PageContainer, HeaderSection, Title, Subtitle, Card, 
    Input, Button, Grid2 
} from '../components/ui/SystemDesign';

interface CompraItem extends Producto {
    cantidad_compra: number;
    costo_compra: number;
    subtotal: number;
}

export default function Compras() {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<CompraItem[]>([]);
    const [busqueda, setBusqueda] = useState('');
    
    // Estado del formulario de selección actual
    const [selectedProv, setSelectedProv] = useState<string>('');
    const [selectedProdId, setSelectedProdId] = useState<string>('');
    const [cantidadInput, setCantidadInput] = useState(10);
    const [costoInput, setCostoInput] = useState(0);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar datos iniciales
        const cargarDatos = async () => {
            try {
                const [resProv, resProd] = await Promise.all([
                    client.get('/proveedores'),
                    client.get('/productos')
                ]);
                setProveedores(resProv.data.data);
                setProductos(resProd.data.data);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
        };
        cargarDatos();
    }, []);

    // Cuando se selecciona un producto, pre-llenar el costo
    useEffect(() => {
        if (selectedProdId) {
            const prod = productos.find(p => p.id_producto === parseInt(selectedProdId));
            if (prod) setCostoInput(prod.costo);
        }
    }, [selectedProdId, productos]);

    const agregarAlCarrito = () => {
        if (!selectedProdId) return alert("Selecciona un producto");
        if (cantidadInput <= 0) return alert("Cantidad inválida");

        const prod = productos.find(p => p.id_producto === parseInt(selectedProdId));
        if (!prod) return;

        const nuevoItem: CompraItem = {
            ...prod,
            cantidad_compra: cantidadInput,
            costo_compra: costoInput,
            subtotal: cantidadInput * costoInput
        };

        setCarrito([...carrito, nuevoItem]);
        // Reset inputs parciales
        setSelectedProdId('');
        setCantidadInput(10);
        setCostoInput(0);
    };

    const eliminarItem = (idx: number) => {
        setCarrito(prev => prev.filter((_, i) => i !== idx));
    };

    const confirmarCompra = async () => {
        if (!selectedProv) return alert('Selecciona un proveedor');
        if (carrito.length === 0) return alert('El carrito de compra está vacío');

        setLoading(true);
        const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

        try {
            await client.post('/compras', {
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
            });
            alert('✅ Entrada de mercancía registrada exitosamente.');
            setCarrito([]);
            setSelectedProv('');
        } catch (error: any) {
            alert('Error al registrar compra: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.sku.includes(busqueda)
    );

    return (
        <PageContainer>
            <HeaderSection>
                <div>
                    <Title>Entradas de Mercancía</Title>
                    <Subtitle>Registra compras a proveedores y actualiza stock</Subtitle>
                </div>
            </HeaderSection>

            <Grid2 style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
                
                {/* IZQUIERDA: FORMULARIO DE CAPTURA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* 1. Seleccionar Proveedor */}
                    <Card>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Truck size={18} color="var(--primary)"/> Datos del Proveedor
                        </h3>
                        <select 
                            style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '12px', border: '1px solid #E5E5EA', background: '#F2F2F7' }}
                            value={selectedProv}
                            onChange={e => setSelectedProv(e.target.value)}
                        >
                            <option value="">-- Selecciona Proveedor --</option>
                            {proveedores.map(p => (
                                <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                            ))}
                        </select>
                    </Card>

                    {/* 2. Agregar Productos */}
                    <Card>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                            <Package size={18} color="var(--primary)"/> Agregar Producto
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: '#999' }} />
                                <Input 
                                    placeholder="Filtrar lista..." 
                                    value={busqueda} 
                                    onChange={e => setBusqueda(e.target.value)}
                                    style={{ paddingLeft: 36, marginBottom: 8 }}
                                />
                                <select 
                                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '12px', border: '1px solid #E5E5EA', background: '#F2F2F7' }}
                                    value={selectedProdId}
                                    onChange={e => setSelectedProdId(e.target.value)}
                                    size={5} // Muestra lista desplegada
                                >
                                    {productosFiltrados.map(p => (
                                        <option key={p.id_producto} value={p.id_producto}>
                                            {p.nombre} (Stock: {p.stock_actual})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Cantidad</label>
                                    <Input 
                                        type="number" 
                                        value={cantidadInput} 
                                        onChange={e => setCantidadInput(parseInt(e.target.value))} 
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Costo Unitario ($)</label>
                                    <Input 
                                        type="number" 
                                        value={costoInput} 
                                        onChange={e => setCostoInput(parseFloat(e.target.value))} 
                                    />
                                </div>
                            </div>

                            <Button onClick={agregarAlCarrito} disabled={!selectedProdId} $variant="secondary">
                                <Plus size={18} /> Agregar a la Orden
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* DERECHA: RESUMEN DE ORDEN */}
                <Card style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                        📝 Orden de Entrada
                    </h3>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {carrito.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
                                <p>No hay productos en la orden</p>
                            </div>
                        ) : (
                            carrito.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed #eee' }}>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>
                                            {item.cantidad_compra} unidades x ${item.costo_compra}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontWeight: 700 }}>${item.subtotal.toFixed(2)}</div>
                                        <Trash2 
                                            size={16} 
                                            color="var(--danger)" 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => eliminarItem(idx)}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '20px', fontWeight: 800 }}>
                            <span>Total Compra:</span>
                            <span>${carrito.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</span>
                        </div>
                        <Button 
                            style={{ width: '100%', height: '50px', fontSize: '16px' }} 
                            onClick={confirmarCompra}
                            disabled={loading || carrito.length === 0}
                        >
                            {loading ? 'Registrando...' : <><CheckCircle size={20}/> Confirmar Entrada</>}
                        </Button>
                    </div>
                </Card>

            </Grid2>
        </PageContainer>
    );
}