import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import client from '../api/client';
import { Producto, ApiResponse } from '../types';
import { generarTicketPDF } from '../utils/exportUtils';
import { Search, Printer, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartItem extends Producto {
    cantidad: number;
    subtotal: number;
}

export default function POS() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [carrito, setCarrito] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        client.get<ApiResponse<Producto[]>>('/productos')
            .then(res => setProductos(res.data.data))
            .catch(err => console.error(err));
    }, []);

    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.sku.includes(busqueda)
    );

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

    const modificarCantidad = (id: number, delta: number) => {
        setCarrito(prev => prev.map(item => {
            if (item.id_producto === id) {
                const nuevaCant = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: nuevaCant, subtotal: nuevaCant * item.precio_venta };
            }
            return item;
        }));
    };

    const eliminarDelCarrito = (id: number) => {
        setCarrito(prev => prev.filter(item => item.id_producto !== id));
    };

    const totalVenta = carrito.reduce((sum, item) => sum + item.subtotal, 0);

    const cobrar = async () => {
        if (carrito.length === 0) return;
        setLoading(true);
        try {
            const res = await client.post('/ventas', {
                venta: { total: totalVenta, metodo_pago: 'Efectivo', id_usuario: 1 },
                detalles: carrito.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_venta,
                    subtotal: item.subtotal
                }))
            });
            
            if (res.data.success) {
                setTimeout(() => {
                    if (confirm('✅ Venta Exitosa. ¿Imprimir Ticket?')) generarTicketPDF({ total: totalVenta }, carrito);
                }, 100);
                setCarrito([]);
            }
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <StyledWrapper>
            <div className="master-container">
                
                {/* IZQUIERDA: CATÁLOGO (Adaptado al estilo visual) */}
                <div className="card coupons">
                    <label className="title">Catálogo de Productos</label>
                    <div className="form">
                        <div style={{position: 'relative', width: '100%'}}>
                            <Search size={16} style={{position: 'absolute', left: 10, top: 12, color: '#999'}} />
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre o SKU..." 
                                className="input_field" 
                                style={{paddingLeft: 35}}
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="grid-productos">
                        {productosFiltrados.map(prod => (
                            <div key={prod.id_producto} className="product-card" onClick={() => agregarAlCarrito(prod)}>
                                <div className="icon-box">
                                    <ShoppingCart size={20} color="#FF8413" />
                                </div>
                                <div className="info">
                                    <span className="name">{prod.nombre}</span>
                                    <p className="sku">SKU: {prod.sku}</p>
                                    <p className="stock">Stock: {prod.stock_actual}</p>
                                </div>
                                <label className="price-tag">${prod.precio_venta}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DERECHA: CARRITO (Tu diseño exacto) */}
                <div className="right-column">
                    <div className="card cart">
                        <label className="title">Carrito de Venta</label>
                        <div className="products">
                            {carrito.length === 0 ? <div style={{padding:20, textAlign:'center', color:'#999'}}>Carrito Vacío</div> : 
                                carrito.map(item => (
                                    <div key={item.id_producto} className="product">
                                        {/* Icono SVG del diseño original */}
                                        <svg fill="none" viewBox="0 0 60 60" height={60} width={60}>
                                            <rect fill="#FFF6EE" rx="8.25" height={60} width={60} />
                                            <path strokeLinecap="round" strokeWidth="2.25" stroke="#FF8413" d="M20 27H40" /> 
                                            <path strokeLinecap="round" strokeWidth="2.25" stroke="#FF8413" d="M30 20V34" />
                                        </svg>
                                        
                                        <div>
                                            <span>{item.nombre}</span>
                                            <p>{item.sku}</p>
                                            <p onClick={() => eliminarDelCarrito(item.id_producto)} style={{color: '#ef4444', cursor: 'pointer'}}>Eliminar</p>
                                        </div>
                                        
                                        <div className="quantity">
                                            <button onClick={() => modificarCantidad(item.id_producto, -1)}>
                                                <Minus size={12} />
                                            </button>
                                            <label>{item.cantidad}</label>
                                            <button onClick={() => modificarCantidad(item.id_producto, 1)}>
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <label className="price small">${item.subtotal.toFixed(2)}</label>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="card checkout">
                        <label className="title">Resumen</label>
                        <div className="details">
                            <span>Subtotal:</span>
                            <span>${(totalVenta * 0.84).toFixed(2)}</span>
                            <span>IVA (16%):</span>
                            <span>${(totalVenta * 0.16).toFixed(2)}</span>
                        </div>
                        <div className="checkout--footer">
                            <label className="price"><sup>$</sup>{totalVenta.toFixed(2)}</label>
                            <button className="checkout-btn" onClick={cobrar} disabled={loading || carrito.length === 0}>
                                {loading ? '...' : 'COBRAR'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* LAYOUT GRID */
  .master-container {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
    height: calc(100vh - 40px);
  }

  .right-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* ESTILOS ORIGINALES ADAPTADOS */
  .card {
    background: #FFFFFF;
    box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
    border-radius: 19px;
    overflow: hidden;
  }

  .title {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #efeff3;
    font-weight: 700;
    font-size: 14px;
    color: #63656b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* PRODUCTOS GRID (IZQUIERDA) */
  .grid-productos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
    padding: 20px;
    max-height: calc(100vh - 150px);
    overflow-y: auto;
  }

  .product-card {
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .product-card:hover {
    border-color: #4480FF;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  }

  .product-card .name {
    font-weight: 600;
    font-size: 14px;
    color: #47484b;
    display: block;
    margin-bottom: 5px;
  }

  .product-card .sku, .product-card .stock {
    font-size: 11px;
    color: #7a7c81;
    margin: 0;
  }

  .product-card .price-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    font-weight: 800;
    color: #4480FF;
  }

  /* CART (DERECHA) */
  .cart .products {
    display: flex;
    flex-direction: column;
    padding: 10px;
    max-height: 400px;
    overflow-y: auto;
  }

  .cart .products .product {
    display: grid;
    grid-template-columns: 60px 1fr 80px 70px;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px dashed #eee;
    align-items: center;
  }

  .cart .products .product span {
    font-size: 13px;
    font-weight: 600;
    color: #47484b;
    display: block;
  }

  .cart .products .product p {
    font-size: 11px;
    font-weight: 600;
    color: #7a7c81;
    margin: 0;
  }

  .cart .quantity {
    height: 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 7px;
    filter: drop-shadow(0px 1px 0px #efefef) drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  }

  .cart .quantity label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #47484b;
  }

  .cart .quantity button {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: transparent;
    cursor: pointer;
  }

  .cart .small {
    font-size: 15px;
    font-weight: 700;
    text-align: right;
  }

  /* CHECKOUT */
  .checkout .details {
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    gap: 10px;
  }

  .checkout .details span {
    font-size: 13px;
    font-weight: 600;
    color: #47484b;
  }

  .checkout .details span:nth-child(odd) {
    font-size: 12px;
    color: #707175;
  }

  .checkout .checkout--footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background-color: #efeff3;
  }

  .price {
    font-size: 26px;
    color: #2B2B2F;
    font-weight: 900;
  }

  .price sup {
    font-size: 14px;
    margin-right: 2px;
  }

  .checkout-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 45px;
    background: linear-gradient(180deg, #4480FF 0%, #115DFC 50%, #0550ED 100%);
    box-shadow: 0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5);
    border-radius: 7px;
    border: 0;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .checkout-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 5px 15px rgba(68, 128, 255, 0.4);
  }
  
  .checkout-btn:disabled {
    background: #ccc;
    transform: none;
    box-shadow: none;
  }

  .coupons .form {
      padding: 20px;
      display: flex;
      gap: 10px;
  }
  
  .input_field {
    width: 100%;
    height: 42px;
    padding: 0 0 0 12px;
    border-radius: 5px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef) drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s;
  }
  
  .input_field:focus {
      border-color: #4480FF;
  }
`;