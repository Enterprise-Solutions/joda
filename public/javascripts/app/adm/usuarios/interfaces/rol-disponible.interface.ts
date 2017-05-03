export class RolDisponible {
    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public seleccionado: boolean
    ) { }

    updateRol(
        id: number,
        nombre: string,
        descripcion: string,
        seleccionado: boolean) {

        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.seleccionado = seleccionado;
    }
}