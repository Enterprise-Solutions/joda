export class Organigrama {
    constructor(
        public id?: number,
        public org_organigrama_parte_id?: number,
        public nombre?: string,
        public org_organigrama_id?: number,
        public tipo?: string,
        public partes: Organigrama[] = [],
        public descripcion?: string,

        // Agregado para UI
        public expandido: boolean = false,
        public tipoCaret: string = 'fa fa-caret-right fa-fw',
        public es_editable: boolean = false
    ) { }
}