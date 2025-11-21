import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del Pool
// Usamos variables de entorno para seguridad, pero definimos defaults para desarrollo local
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'papeleria_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true // Importante para recibir DECIMAL como number en JS y no como string
});

// Test de conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error conectando a MySQL:', error);
        process.exit(1); // Detener si no hay BD
    });

export default pool;