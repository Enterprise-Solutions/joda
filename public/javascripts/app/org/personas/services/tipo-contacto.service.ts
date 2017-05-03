import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class TipoContactoService {
    constructor(public _http: Http) { }

    getTipoContactos() {
        return this._http.get('/org/contactos-tipos')
            .map(res => { return res.json().rows });
    }
}