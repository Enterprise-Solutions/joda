import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OperacionesRolService {
    constructor(public _http: Http) { }

    getOperacionesDeRol(rol_id: number) {
        return this._http.get('/adm/roles/' + rol_id + '/operaciones')
            .map(res => { return res.json(); });
    }

    crearRolOperaciones(id: number, jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/roles/' + id + '/operaciones', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    borrarOperacion(id: number, jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/roles/' + id + '/operaciones-borradas', jsonData, { headers: headers })
            .map(res => { return res; });
    }


};