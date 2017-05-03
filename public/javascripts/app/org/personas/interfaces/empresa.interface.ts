import {Documento} from '../../documentos/interfaces/documento.interface';
import {Direccion} from '../../direcciones/interfaces/direccion.interface';

export class Empresa {
    constructor(
        public id?: number,
        public org_organigrama_id?: number,
        public nombre?: string,
        public doc?: Documento,
        public dir?: Direccion
    ) { }
}