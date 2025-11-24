import { Request, Response } from 'express';
import { UsuarioService } from './services/UsuarioService';

export class UsuariosController {
    private service = new UsuarioService();
    listar = async (req: Request, res: Response) => {
        const data = await this.service.obtenerTodos();
        res.json({ success: true, data });
    }
    crear = async (req: Request, res: Response) => {
        const id = await this.service.crear(req.body);
        res.status(201).json({ success: true, data: { id } });
    }
}