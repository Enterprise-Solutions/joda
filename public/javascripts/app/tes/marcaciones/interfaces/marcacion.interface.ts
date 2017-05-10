export class Marcacion {
    constructor(
        public id?: number,
        public email?: string,
        public apellido?: string,
        public nombre?: string,
        public password?: string) {}
}

export class horasTrabajadas{
    constructor(
        public email?:string,
        public fecha?:string,
        public horas?:number,
        public minutos?:number,
        public segundos?:number){}
}
