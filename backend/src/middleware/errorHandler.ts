// archivo: backend/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/utils/AppError';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500;
    let message = 'Error interno del servidor';

    // Si es un error controlado por nosotros
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } 
    // Si es un error de sintaxis JSON (body mal formado)
    else if (err instanceof SyntaxError && 'body' in err) {
        statusCode = 400;
        message = 'JSON mal formado en el cuerpo de la petición';
    }
    else {
        // Loguear el error real en el servidor para debug (pero no enviarlo al cliente en prod)
        console.error('🔥 ERROR NO CONTROLADO:', err);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        // En desarrollo podrías querer ver el stack, en producción NO.
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};