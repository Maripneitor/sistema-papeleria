// archivo: backend/src/config/db.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Asegurar carga de .env
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'papeleria_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Importante para que los DECIMAL de MySQL se lean como números en JS, 
    // aunque cuidado con precisión en montos muy grandes.
    decimalNumbers: true 
};

const pool = mysql.createPool(dbConfig);

// Verificación inicial de conexión
pool.getConnection()
    .then((connection) => {
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        connection.release();
    })
    .catch((err) => {
        console.error('❌ Error al conectar con la base de datos:', err.message);
        process.exit(1); // Salir si no hay DB
    });

export default pool;