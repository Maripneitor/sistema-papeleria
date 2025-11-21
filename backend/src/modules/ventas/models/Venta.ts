import { Venta, MetodoPago } from '../../../shared/types';

export class VentaModel implements Venta {
    constructor(
        public id_venta: number,
        public fecha: Date,
        public total: number,
        public metodo_pago: MetodoPago,
        public id_usuario: number
    ) {}

    public validar(): boolean {
        return this.total > 0 && 
               this.id_usuario > 0 &&
               this.metodo_pago.length > 0;
    }
}