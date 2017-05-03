export class Ubicacion {
	public org_ubicacion_tipo_id: string;
	public longitud: string;
	public latitud: string;
	public nombre: string;
	public es_editable: boolean;

	constructor(
		org_ubicacion_tipo_id: string,
		longitud: string,
		latitud: string,
		nombre: string
	) {
		this.org_ubicacion_tipo_id = org_ubicacion_tipo_id;
		this.longitud = longitud;
		this.latitud = latitud;
		this.nombre = nombre;
	};
}