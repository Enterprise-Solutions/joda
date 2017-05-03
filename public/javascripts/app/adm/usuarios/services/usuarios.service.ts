import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsuariosService {
    constructor(public _http: Http) { }

    getUsuarios(search = null, pagination = null, order = null) {
        let fetchUrl = '/adm/usuarios';
        let params = [];

        for (var prop in search) {
            if (search[prop] !== undefined) {
                params.push(prop + '=' + search[prop]);
            }
        }

        for (var prop in pagination) {
            if (pagination[prop] !== undefined) {
                params.push(prop + '=' + pagination[prop]);
            }
        }

        for (var prop in order) {
            if (order[prop] !== undefined) {
                params.push(prop + '=' + order[prop]);
            }
        }

        if (params.length) {
            fetchUrl += '?' + params.join('&');
        }

        return this._http.get(fetchUrl)
            .map(res => { return res.json(); });
    }

    getPersonasDisponibles(persona: string) {
        return this._http.get('/adm/usuarios-personas?busqueda=' + persona)
            .map(res => { return res.json(); });
    }

    getUsuario(id: number | string) {
        return this._http.get('/adm/usuarios/' + id)
            .map(res => { return res.json(); });
    }

    crearUsuario(jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    crearUsuarioPersona(jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios-personas', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarUsuario(id: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/adm/usuarios/'+id, jsonData, { headers: headers })
            .map((res) => { return res.json().rows; });
    }

    cambiarPassword(jsonData: string){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/adm/usuario/editar-contrasena', jsonData, { headers: headers })
            .map((res) => { return res.json() });
    }

    crearPerfilUsuario(id:number, jsonData: string){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios/'+id+'/perfiles', jsonData, {headers: headers})
            .map(res => { return res.json().rows; });
    }

    editarPerfilUsuario(id:number, idPerfil: number | string, jsonData: string){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/adm/usuarios/'+id+'/perfiles/'+idPerfil , jsonData, {headers: headers})
            .map(res => { return res.json(); });
    }

    getPerfilesUsuario(id: number | string) {
        return this._http.get('/adm/usuarios/' + id + '/perfiles')
            .map(res => { return res.json(); });
    }

    getPerfiles(){
        return this._http.get('/adm/usuario/perfiles')
            .map(res => { return res.json(); });
    }

    getEstados(){
        return this._http.get('/adm/usuarios/estados')
            .map(res => { return res.json(); });
    }

    getPerfilUsuario(id: number | string, idPerfil: number | string) {
        return this._http.get('/adm/usuarios/' + id + '/perfiles/' + idPerfil)
            .map(res => { return res.json(); });
    }

    borrarPerfilUsuario(id: number | string, id_adm_usuario_perfil: number | string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.delete('/adm/usuarios/' + id + '/perfiles/' + id_adm_usuario_perfil, { headers: headers })
            .map(res => { return res; });
    }

    cambiarPerfilActual(id: number | string) {
        return this._http.get('/adm/usuario/cambiar-perfil/' + id)
            .map(res => { return res.json(); });
    }

    cambiarPerfilPrincipal(id: number | string) {
        return this._http.get('/adm/usuario/cambiar-perfil-principal/' + id)
            .map(res => { return res; });
    }

    subirFotoPerfil(formData: FormData){
        var headers = new Headers();
        headers.set('Content-Type', 'multipart/form-data');

        return this._http.post('/adm/usuario/foto', formData, {headers: headers})
            .map(res => { return res; });
    }

    descargarFotoPerfil(){
        return this._http.get('/adm/usuario/foto')
            .map(res => { return res; });
    }

    // Lista los areas asociadas a un perfil
    getPerfilAreas(usuarioId: number | string, perfilId: number | string, parteId: number | string ) {
        return this._http.get('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/partes/' + parteId)
            .map(res => { return res.json(); });
    }

    getPartesDisponibles(usuarioId: number | string, perfilId: number | string, parteId: number | string ) {
        return this._http.get('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/partes-disponibles/' + parteId)
            .map(res => { return res.json(); });
    }

    borrarAreaUsuario(usuarioId: number | string, perfilId: number | string, parteId: number | string, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/partes-borradas/' + parteId,  jsonData, {headers: headers})
            .map(res => { return res; });
    }

    crearAreaUsuario(usuarioId: number | string, perfilId: number | string, parteId: number | string, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/usuarios/' + usuarioId + '/perfiles/' + perfilId + '/partes/' + parteId,  jsonData, {headers: headers})
            .map(res => { return res; });
    }
};