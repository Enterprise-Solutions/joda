export class Contacto {
    constructor (
        public id?:number,
        public org_parte_id?:number,
        public org_contacto_tipo_id?: string,
        public contacto?: string,
        public es_editable?: boolean
    ) { };
}