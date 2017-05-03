export class Direccion {
	constructor(
		public id?: number,
		public direccion?: string,
		public numero?: string,
		public es_principal?: boolean,
		public descripcion?: string,
		public org_parte_id?: number,
        public es_editable?: boolean,
		public org_ubicacion_id?: number
	) { };
}