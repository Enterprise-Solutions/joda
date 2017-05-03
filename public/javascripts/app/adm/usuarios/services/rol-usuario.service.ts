import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RolUsuarioService {
    constructor(public _http: Http) { }

    // Lista los roles asociados a un perfil
    getPerfilRoles(usuarioId: number | string, perfilId: number | string ) {
        return this._http.get('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/roles')
            .map(res => { return res.json(); });
    }

    getPerfilRolOperaciones(usuarioId: number | string, perfilId: number | string, rolId: number | string ) {
        return this._http.get('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/roles/' + rolId)
            .map(res => { return res.json(); });
    }

    // Asocia roles a un perfil de un usuario
    crearPerfilRoles(usuarioId: number | string, perfilId: number | string, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios/' + usuarioId+ '/perfiles/'+ perfilId + '/roles', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    getRolesDisponibles(usuarioId: number | string, perfilId: number | string ) {
        return this._http.get('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/roles-disponibles')
            .map(res => { return res.json().rows; });
    }

    borrarPerfilRoles(usuarioId: number | string, perfilId: number | string, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/roles-borrados', jsonData, { headers: headers })
            .map(res => { return res; });
    }



};