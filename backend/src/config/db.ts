import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'papeleria_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Error conectando a MySQL:', error);
        process.exit(1);
    });

export default pool;
