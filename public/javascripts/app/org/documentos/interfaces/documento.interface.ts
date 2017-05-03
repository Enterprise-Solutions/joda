export class Documento {
    constructor(
        public id?: number,
        public org_parte_id?: number,
        public org_documento_tipo_id?: number,
        public documento?: string,
        public es_principal?: boolean,
        public tipo?: string,
        public es_editable?: boolean) { }
}