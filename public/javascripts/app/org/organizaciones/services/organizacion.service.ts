import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OrganizacionService {
    constructor(public _http: Http) { }

    getOrganizaciones(search = null, pagination = null, order = null) {
        let fetchUrl = '/org/organizaciones';
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

    crearOrganizacion(jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/organizaciones', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    getOrganizacion(id: number | string) {
        return this._http.get('/org/organizaciones/' + id)
            .map(res => { return res.json(); });
    }

    editarOrganizacion(id: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/org/organizaciones/'+id, jsonData, { headers: headers })
            .map((res) => {
                return res;
            });
    }

    borrarOrganizacion(id: number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.delete('/org/organizaciones/' + id, { headers: headers })
            .map(res => {return res.json(); });
    }

    getTipoDocumentosOrganizaciones() {
        return this._http.get('/org/organizaciones/tipos-documentos')
            .map((res) => { return res.json().rows; });
    }
};