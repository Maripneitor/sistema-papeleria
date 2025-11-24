// Respuesta genérica de la API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Definición de Producto
export interface Producto {
    id_producto: number;
    sku: string;
    nombre: string;
    descripcion?: string;
    precio_venta: number;
    costo: number;
    stock_actual?: number;     // Opcional porque a veces viene de join
    categoria?: string;        // ¡Aquí está la propiedad que faltaba!
    marca?: string;
    estado?: 'activo' | 'inactivo';
    rotacion?: 'alta' | 'media' | 'baja';
}

// Definición de Proveedor
export interface Proveedor {
    id_proveedor: number;
    nombre: string;
    contacto?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
}

// Definición de Usuario
export interface Usuario {
    id_usuario: number;
    nombre: string;
    usuario: string;
    rol: 'admin' | 'empleado';
    activo?: boolean;
    // No incluimos password_hash aquí por seguridad en el frontend
}