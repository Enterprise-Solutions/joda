import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContactoService {
    constructor(public _http: Http) { }

    getTiposContacto() {
        return this._http.get('/org/contactos-tipos')
            .map(res => { return res.json(); });
    }

    getContactosParte(orgParteId: number) {
        return this._http.get('/org/partes/' + orgParteId + '/contactos')
            .map(res => { return res.json(); });
    }

    crearContacto(orgParteId: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.post('/org/partes/' + orgParteId + '/contactos', jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    editarContacto(orgParteId: number, id: number, jsonData: string) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this._http.put('/org/partes/' + orgParteId + '/contactos/' + id, jsonData, { headers: headers })
            .map(res => { return res.json(); });
    }

    borrarContacto(orgParteId: number, id: number) {
        return this._http.delete('/org/partes/' + orgParteId + '/contactos/' + id)
            .map(res => { return res; });
    }
}