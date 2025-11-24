import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';
import { generarTicketPDF } from '../utils/exportUtils';
import { 
    Search, ShoppingCart, Plus, Minus, Trash2, 
    CreditCard, Package 
} from 'lucide-react';

// Importamos nuestro sistema de diseño
import { 
    PageContainer, Card, Input, Button, Title, Subtitle 
} from '../components/ui/SystemDesign';

// --- STYLED COMPONENTS ESPECÍFICOS PARA POS ---

const PosLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  height: calc(100vh - 100px); /* Ajuste para viewport */
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  padding-bottom: 20px;
  max-height: calc(100vh - 220px);
  
  /* Scrollbar moderna */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background-color: #D1D1D6; border-radius: 4px; }
`;

const ProductCard = styled(Card)`
  padding: 16px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .stock-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 11px;
    font-weight: 700;
    color: var(--text-secondary);
  }
`;

const CartSection = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0; /* Padding manual interno */
  overflow: hidden;
  position: sticky;
  top: 20px;
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
  &::-webkit-scrollbar { width: 6px; }
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #E5E5EA;
  
  &:last-child { border-bottom: none; }

  .info {
    flex: 1;
    h4 { margin: 0; font-size: 14px; font-weight: 600; color: var(--text-primary); }
    p { margin: 2px 0 0; font-size: 12px; color: var(--text-secondary); }
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #F2F2F7;
    padding: 4px;
    border-radius: 8px;
  }
  
  .qty-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    &:hover { color: var(--primary); }
  }
`;

const CheckoutFooter = styled.div`
  background: #FAFAFA;
  padding: 24px;
  border-top: 1px solid #E5E5EA;

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .total {
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    margin-top: 12px;
    margin-bottom: 20px;
  }
`;

// --- INTERFACES ---
interface CartItemType extends Producto {
    cantidad: number;
    subtotal: number;
}

export default function POS() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [carrito, setCarrito] = useState<CartItemType[]>([]);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Cargar catálogo inicial
    useEffect(() => {
        client.get<ApiResponse<Producto[]>>('/productos')
            .then(res => setProductos(res.data.data))
            .catch(err => console.error(err));
    }, []);

    // Enfoque automático al buscador
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F2') searchInputRef.current?.focus();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filtrado inteligente
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        p.sku.includes(busqueda)
    );

    // Lógica del Carrito
    const agregarAlCarrito = (prod: Producto) => {
        setCarrito(prev => {
            const existe = prev.find(item => item.id_producto === prod.id_producto);
            if (existe) {
                return prev.map(item => 
                    item.id_producto === prod.id_producto
                        ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_venta }
                        : item
                );
            }
            return [...prev, { ...prod, cantidad: 1, subtotal: prod.precio_venta }];
        });
    };

    const modificarCantidad = (id: number, delta: number) => {
        setCarrito(prev => prev.map(item => {
            if (item.id_producto === id) {
                const nueva = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: nueva, subtotal: nueva * item.precio_venta };
            }
            return item;
        }));
    };

    const eliminarItem = (id: number) => {
        setCarrito(prev => prev.filter(item => item.id_producto !== id));
    };

    // Cálculos
    const totalVenta = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = totalVenta * 0.16;
    const subtotal = totalVenta - iva;

    const cobrar = async () => {
        if (carrito.length === 0) return;
        setLoading(true);

        try {
            const payload = {
                venta: { total: totalVenta, metodo_pago: 'Efectivo', id_usuario: 1 },
                detalles: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_venta,
                    subtotal: item.subtotal
                }))
            };

            const res = await client.post('/ventas', payload);

            if (res.data.success) {
                generarTicketPDF({ total: totalVenta }, carrito);
                setCarrito([]);
            }
        } catch (error: any) {
            alert('Error al procesar venta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <Title>Punto de Venta</Title>
                    <Subtitle>Registra ventas y gestiona el carrito</Subtitle>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Presiona <b>F2</b> para buscar
                </div>
            </div>

            <PosLayout>
                {/* IZQUIERDA: CATÁLOGO */}
                <div>
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: 13, color: '#999' }} />
                        <Input 
                            ref={searchInputRef}
                            placeholder="Buscar producto por nombre, SKU o código..." 
                            style={{ paddingLeft: '40px', height: '48px', fontSize: '16px' }}
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <ProductGrid>
                        {productosFiltrados.map(prod => (
                            <ProductCard key={prod.id_producto} onClick={() => agregarAlCarrito(prod)}>
                                <span className="stock-badge">Stock: {prod.stock_actual}</span>
                                <div style={{ 
                                    width: 40, height: 40, background: '#F2F2F7', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                                    color: 'var(--primary)'
                                }}>
                                    <Package size={20} />
                                </div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--text-primary)' }}>{prod.nombre}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{prod.sku}</p>
                                <div style={{ marginTop: '12px', fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>
                                    ${prod.precio_venta}
                                </div>
                            </ProductCard>
                        ))}
                    </ProductGrid>
                </div>

                {/* DERECHA: TICKET / CARRITO */}
                <CartSection>
                    <div style={{ padding: '20px', borderBottom: '1px solid #E5E5EA', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <ShoppingCart size={20} color="var(--primary)" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Ticket Actual</h3>
                    </div>

                    <CartList>
                        {carrito.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>
                                <Package size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                <p>El carrito está vacío</p>
                            </div>
                        ) : (
                            carrito.map(item => (
                                <CartItem key={item.id_producto}>
                                    <div className="info">
                                        <h4>{item.nombre}</h4>
                                        <p>${item.precio_venta} x {item.cantidad}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="controls">
                                            <button className="qty-btn" onClick={() => modificarCantidad(item.id_producto, -1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                                                {item.cantidad}
                                            </span>
                                            <button className="qty-btn" onClick={() => modificarCantidad(item.id_producto, 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div style={{ minWidth: '60px', textAlign: 'right', fontWeight: '600' }}>
                                            ${item.subtotal.toFixed(2)}
                                        </div>
                                        <Trash2 
                                            size={16} 
                                            color="var(--danger)" 
                                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                                            onClick={() => eliminarItem(item.id_producto)}
                                        />
                                    </div>
                                </CartItem>
                            ))
                        )}
                    </CartList>

                    <CheckoutFooter>
                        <div className="row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="row">
                            <span>IVA (16%)</span>
                            <span>${iva.toFixed(2)}</span>
                        </div>
                        <div className="row total">
                            <span>Total</span>
                            <span>${totalVenta.toFixed(2)}</span>
                        </div>

                        {/* CORRECCIÓN: Usamos $variant */}
                        <Button 
                            $variant="primary" 
                            style={{ width: '100%', height: '52px', fontSize: '16px' }}
                            disabled={loading || carrito.length === 0}
                            onClick={cobrar}
                        >
                            {loading ? 'Procesando...' : (
                                <>
                                    <CreditCard size={20} /> Cobrar Ticket
                                </>
                            )}
                        </Button>
                    </CheckoutFooter>
                </CartSection>
            </PosLayout>
        </PageContainer>
    );
}