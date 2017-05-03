import {Persona} from "../../../org/personas/interfaces/persona.interface";

export class Usuario {
    constructor(
        public id?: number,
        public org_persona_id?: number,
        public nombre?: string,
        public apellido?: string,
        public email?: string,
        public password?: string,
        public confirmar_pass?: string,
        public cambiar_pwd?: boolean,
        public estado?: string,
        public estado_nombre?: string,
        public persona?: Persona) { }
}