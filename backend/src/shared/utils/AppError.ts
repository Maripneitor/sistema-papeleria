// archivo: backend/src/shared/utils/AppError.ts

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Errores controlados (validación, lógica) vs Bugs

        Error.captureStackTrace(this, this.constructor);
    }
}