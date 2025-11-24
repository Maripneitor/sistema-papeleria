// archivo: backend/src/index.ts

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import 'express-async-errors'; // Parche para que Express maneje errores en async/await automáticamente

import routerApp from './routes'; // Asumimos que exporta el router principal
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './shared/utils/AppError';

// 1. Configuración inicial
dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares Globales
app.use(helmet()); // Seguridad de headers HTTP
app.use(cors()); // Permitir peticiones de otros dominios (Frontend)
app.use(express.json()); // Parsear body JSON
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// Middleware de Logging Básico (puedes cambiarlo por Morgan si prefieres)
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// 3. Rutas de la API
app.use('/api', routerApp);

// 4. Ruta Base / Health Check
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Sistema Papelería API v1.0',
        status: 'Running',
        timestamp: new Date()
    });
});

// 5. Manejo de Ruta No Encontrada (404)
app.use((req: Request, res: Response, next: NextFunction) => {
    throw new AppError(`La ruta ${req.originalUrl} no existe en este servidor`, 404);
});

// 6. Middleware Global de Errores (Siempre al final)
app.use(errorHandler);

// 7. Inicialización del Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});