export type RolUsuario = 'admin' | 'empleado';
export type EstadoProducto = 'activo' | 'inactivo';
export type RotacionProducto = 'alta' | 'media' | 'baja';

export interface Usuario {
    id_usuario: number;
    nombre: string;
    usuario: string;
    password_hash: string;
    rol: RolUsuario;
    activo: boolean;
}

export interface Proveedor {
    id_proveedor: number;
    nombre: string;
    contacto?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
}

export interface Producto {
    id_producto: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    categoria?: string;
    marca?: string;
    precio_venta: number;
    costo: number;
    codigo_barras?: string;
    fecha_alta: Date;
    fecha_ultima_venta?: Date;
    estado: EstadoProducto;
    rotacion: RotacionProducto;
}

export interface Inventario {
    id_inventario: number;
    id_producto: number;
    stock_actual: number;
    stock_minimo: number;
    stock_maximo: number;
    ubicacion?: string;
    fecha_ultima_actualizacion: Date;
}

export interface Venta {
    id_venta: number;
    fecha: Date;
    total: number;
    metodo_pago: string;
    id_usuario: number;
}

export interface VentaDetalle {
    id_detalle: number;
    id_venta: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface Compra {
    id_compra: number;
    fecha: Date;
    total: number;
    id_proveedor: number;
}

export interface CompraDetalle {
    id_detalle_compra: number;
    id_compra: number;
    id_producto: number;
    cantidad: number;
    costo_unitario: number;
    subtotal: number;
}

export interface BitacoraMovimiento {
    id_movimiento: number;
    tipo: string;
    id_referencia: number;
    descripcion?: string;
    fecha: Date;
    id_usuario: number;
}
