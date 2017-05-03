import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    private org_organigrama_id: number;

    constructor(
        private _http: Http) { }

    getLoggerUsername() {
        return this._http.get('/adm/usuario')
            .map(res => { return res.json(); });
    }

    getOrgOrganigramaId() {
        return this.org_organigrama_id;
    }

    setOrgOrganigramaId(org_organigrama_id: number) {
        this.org_organigrama_id = org_organigrama_id;
    }
}