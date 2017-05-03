import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TiposDocumentosService {
    constructor(public _http: Http) { }

    getTiposDocumentos(search, pagination, order) {

        let fetchUrl = '/org/tipo-documentos';
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

    getTipoDocumento(id: number | string) {
        return this._http.get('/org/tipo-documentos/' + id)
            .map(res => { return res.json(); });
    }

    crearTipoDocumento(jsonData:string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/tipo-documentos', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarTipoDocumento(id: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/org/tipo-documentos/'+id, jsonData, { headers: headers })
            .map((res) => { return res.json().rows; });
    }

    //TODO: la respuesta no esta siendo enviada como JSON
    borrarTipoDocumento(id: number) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.delete('/org/tipo-documentos/' + id, { headers: headers })
            .map(res => {return res });
    }
};
