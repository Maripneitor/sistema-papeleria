import pool from './config/db';

const seed = async () => {
    console.log('🌱 Sembrando datos iniciales...');
    try {
        // Crear Usuario Admin (ID 1 forzado)
        await pool.query(`
            INSERT IGNORE INTO usuarios (id_usuario, nombre, usuario, password_hash, rol) 
            VALUES (1, 'Administrador', 'admin', 'admin123', 'admin')
        `);
        console.log('✅ Usuario Admin creado (ID: 1)');
        
        // Crear un Proveedor Genérico (Para futuras pruebas de compras)
        await pool.query(`
            INSERT IGNORE INTO proveedores (id_proveedor, nombre, contacto) 
            VALUES (1, 'Proveedor General', 'Ventas Directas')
        `);
        console.log('✅ Proveedor General creado (ID: 1)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    }
};

seed();
