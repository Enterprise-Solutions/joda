export class OperacionDisponible {
    constructor(
        public id: number,
        public adm_cu_id: number,
        public nombre: string,
        public codigo: string,
        public seleccionado: boolean
    ) { }
}