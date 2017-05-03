export class RolUsuario {
    constructor(
        public id: number,
        public adm_rol_id: number,
        public adm_usuario_perfil_id: number,
        public perfil: string,
        public rol: string
    ) { }
}


