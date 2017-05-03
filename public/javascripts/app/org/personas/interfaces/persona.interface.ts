import {Documento} from '../../documentos/interfaces/documento.interface';
import {Direccion} from '../../direcciones/interfaces/direccion.interface';

export class Persona {
    constructor(
		public id?: number,
        public org_parte_id?: number,
		public org_organigrama_id?: number,
        public nombres?: string,
        public apellidos?: string,
        public fecha_de_nacimiento?: string,
        public doc?: Documento,
        public dir?: Direccion
	) { }
}