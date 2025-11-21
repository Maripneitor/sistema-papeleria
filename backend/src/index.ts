import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/db';
import routerApp from './routes';

// Configuración
dotenv.config();
const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Para entender JSON en el body
app.use(cors());
app.use(helmet());

// Rutas API
app.use('/api', routerApp);

// Ruta base
app.get('/', (req, res) => {
    res.json({ api: 'Sistema Papelería V1', estado: 'online' });
});

// Iniciar servidor
app.listen(port, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    try {
        const connection = await pool.getConnection();
        console.log('✅ Base de datos conectada');
        connection.release();
    } catch (error) {
        console.error('❌ Error BD:', error);
    }
});
