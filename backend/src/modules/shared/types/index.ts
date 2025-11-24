import { RowDataPacket } from 'mysql2';

// --- PRODUCTOS ---
export interface Producto {
    id_producto?: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    categoria?: string;
    marca?: string;
    precio_venta: number;
    costo: number;
    codigo_barras?: string;
    rotacion?: 'alta' | 'media' | 'baja';
    stock_actual?: number;
    estado?: 'activo' | 'inactivo';
}
export interface IProductoRow extends RowDataPacket, Producto {}

// --- INVENTARIO ---
export interface Inventario {
    id_inventario?: number;
    id_producto: number;
    stock_actual: number;
    stock_minimo: number;
}
export interface IInventarioRow extends RowDataPacket, Inventario {}

// --- VENTAS ---
export interface Venta {
    id_venta?: number;
    fecha?: Date;
    total: number;
    metodo_pago: string;
    id_usuario: number;
}
export interface VentaDetalle {
    id_detalle?: number;
    id_venta?: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

// --- COMPRAS ---
export interface Compra {
    id_compra?: number;
    fecha?: Date;
    total: number;
    id_proveedor: number;
}
export interface CompraDetalle {
    id_detalle_compra?: number;
    id_compra?: number;
    id_producto: number;
    cantidad: number;
    costo_unitario: number;
    subtotal: number;
}

// --- PROVEEDORES ---
export interface Proveedor {
    id_proveedor?: number;
    nombre: string;
    contacto?: string;
    telefono?: string;
    correo?: string;
}
export interface IProveedorRow extends RowDataPacket, Proveedor {}

// --- USUARIOS ---
export interface Usuario {
    id_usuario?: number;
    nombre: string;
    usuario: string;
    password_hash: string;
    rol: 'admin' | 'empleado';
    activo?: number;
}
export interface IUsuarioRow extends RowDataPacket, Usuario {}