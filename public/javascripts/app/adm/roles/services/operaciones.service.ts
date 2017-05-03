import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class OperacionesService {
    constructor(public _http: Http) { }

    getOperaciones() {
        return this._http.get('/adm/operaciones')
            .map(res => { return res.json(); });
    }
};