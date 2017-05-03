import {CasoUso} from "./caso-uso.interface";

export class Modulo {
    constructor(
        public id?: number,
        public nombre?: string,
        public codigo?: string,
        public cus?: CasoUso[],
        public isOpen?: boolean) {}
}