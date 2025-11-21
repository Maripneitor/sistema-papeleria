import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/db';

// Configuración
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares base
app.use(express.json());
app.use(cors());
app.use(helmet());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        mensaje: 'Bienvenido a la API del Sistema de Papelería',
        estado: 'online' 
    });
});

// Iniciar servidor
app.listen(port, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    
    // Verificar conexión a BD al iniciar
    try {
        const connection = await pool.getConnection();
        console.log('✅ Base de datos conectada exitosamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error fatal: No se pudo conectar a la BD:', error);
    }
});
