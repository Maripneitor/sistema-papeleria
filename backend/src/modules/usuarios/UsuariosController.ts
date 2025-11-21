import { Request, Response } from 'express';
import { UsuarioService } from './services/UsuarioService';

export class UsuariosController {
    private service: UsuarioService;

    constructor() {
        this.service = new UsuarioService();
    }

    listar = async (req: Request, res: Response) => {
        try {
            const lista = await this.service.obtenerLista();
            res.json({ success: true, data: lista });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    crear = async (req: Request, res: Response) => {
        try {
            const nuevo = await this.service.registrar(req.body);
            res.status(201).json({ success: true, data: nuevo, message: 'Usuario creado exitosamente' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
