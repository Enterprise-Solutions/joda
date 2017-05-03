export class PartesDisponibles {
    constructor(
        public id?: number,
        public org_parte_id?: number,
        public org_organigrama_parte_tipo_id?: string,
        public org_organigrama_id?: number,
        public nombre?: string,
        public descripcion?: string
    ) { }
}