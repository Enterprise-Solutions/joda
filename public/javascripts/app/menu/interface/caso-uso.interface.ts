import {Operacion} from "./operacion.interface";

export class CasoUso {
    constructor(
        public id?: number,
        public nombre?: string,
        public codigo?: string,
        public ops?: Operacion[]) {}
}