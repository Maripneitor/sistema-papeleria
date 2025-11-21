export interface Producto {
    id_producto: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    precio_venta: number;
    costo: number;
    stock_actual?: number; // Opcional porque viene de otra tabla a veces
    estado: 'activo' | 'inactivo';
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
