export class Perfil {
    constructor(
        public id?: number,
        public nombre?: string,
        public adm_usuario_id?: number,
        public org_organigrama_id?: number,
        public organigrama?: string,
        public organigrama_parte?: string,
        public es_principal?: boolean
    ) { }

    updateUsuario(
        id: number,
        nombre: string,
        adm_usuario_id: number,
        org_organigrama_id: number,
        organigrama: string,
        es_principal: boolean) {

        this.id = id;
        this.nombre = nombre;
        this.adm_usuario_id = adm_usuario_id;
        this.org_organigrama_id = org_organigrama_id;
        this.organigrama = organigrama;
        this.es_principal = es_principal;
    }
}