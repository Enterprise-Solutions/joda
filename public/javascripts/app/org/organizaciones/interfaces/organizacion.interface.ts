import {Documento} from "../../documentos/interfaces/documento.interface";
import {Direccion} from "../../direcciones/interfaces/direccion.interface";

export class Organizacion {
    constructor(
        public id?: number,
        public org_parte_id?: number,
        public nombre?: string,
        public documento?: string,
        public tipo_documento?: string,
        public doc?: Documento,
        public dir?: Direccion) { }
}