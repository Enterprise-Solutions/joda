export class Marcacion {
    constructor(
        public usuario_id?: number,
        public lugar_id?: number) {}
}

export class MarcacionL {
    constructor(
        public nombre?: string,
        public apellido?: string,
        public email?: string,
        public fecha?: string,
        public cant?: number,
        public maxd?: string,
        public mind?: string) {}
}
