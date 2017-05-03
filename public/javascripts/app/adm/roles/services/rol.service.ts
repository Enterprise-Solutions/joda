import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RolService {
    constructor(public _http: Http) { }

    getRoles(search, pagination, order) {
        //console.log("S: " + search + " - P: " + pagination);

        let fetchUrl = '/adm/roles';
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

    getRol(id: number) {
        return this._http.get('/adm/roles/' +id)
            .map(res => { return res.json(); });
    }

    crearRol(jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/adm/roles', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarRol(id: number, jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/adm/roles/' + id, jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    borrarRol(id: number) {
        return this._http.delete('/adm/roles/' +id)
            .map(res => { return res; });
    }


};